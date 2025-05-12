package com.example.backend.service.impl;

import com.example.backend.dto.CheckoutDto;
import com.example.backend.dto.PaymentDto;
import com.example.backend.entity.Payment;
import com.example.backend.entity.PaymentFormat;
import com.example.backend.entity.User;
import com.example.backend.repository.PaymentFormatRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.IPaymentService;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final PaymentFormatRepository paymentFormatRepository;
    private final TransactionRepository transactionRepository;
    private final CartServiceImpl cartItemService;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Override
    public PaymentDto createPayment(PaymentDto dto) {
        Payment payment = Payment.builder()
                .paymentStatus(dto.getPaymentStatus() != null ? dto.getPaymentStatus() : "Pending")
                .amount(dto.getAmount())
                .transactionReference(dto.getTransactionReference())
                .isActive(true)
                .user(userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found")))
                .paymentFormat(paymentFormatRepository.findById(dto.getPaymentFormatId()).orElseThrow(() -> new RuntimeException("PaymentFormat not found")))
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        return mapToDto(savedPayment);
    }

    @Override
    public PaymentDto updatePayment(Long id, PaymentDto dto) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (dto.getPaymentStatus() != null) payment.setPaymentStatus(dto.getPaymentStatus());
        if (dto.getAmount() != null) payment.setAmount(dto.getAmount());
        if (dto.getTransactionReference() != null) payment.setTransactionReference(dto.getTransactionReference());

        return mapToDto(paymentRepository.save(payment));
    }

    @Override
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setIsActive(false);
        paymentRepository.save(payment);
    }

    @Override
    public PaymentDto getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!payment.getIsActive()) throw new RuntimeException("Payment is inactive.");

        return mapToDto(payment);
    }

    @Override
    public List<PaymentDto> getAllActivePayments() {
        List<Payment> payments = paymentRepository.findAll()
                .stream()
                .filter(Payment::getIsActive)
                .collect(Collectors.toList());

        return payments.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private PaymentDto mapToDto(Payment payment) {
        return PaymentDto.builder()
                .id(payment.getId())
                .userId(payment.getUser() != null ? payment.getUser().getId() : null)
                .paymentFormatId(payment.getPaymentFormat() != null ? payment.getPaymentFormat().getId() : null)
                .paymentStatus(payment.getPaymentStatus())
                .amount(payment.getAmount())
                .transactionReference(payment.getTransactionReference())
                .isActive(payment.getIsActive())
                .paymentDate(payment.getPaymentDate())
                .build();
    }

    @Override
    public Map<String, String> createPaymentIntent(PaymentDto paymentDto) {
        Stripe.apiKey = stripeSecretKey;

        long amountInCents = Math.round(paymentDto.getAmount() * 100);

        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("usd")
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            Map<String, String> responseData = new HashMap<>();
            responseData.put("clientSecret", intent.getClientSecret());

            savePayment(paymentDto, intent.getId(), amountInCents);
            cartItemService.removeProductFromCartwithUserId(paymentDto.getUserId());

            return responseData;
        } catch (Exception e) {
            throw new RuntimeException("Stripe payment failed: " + e.getMessage(), e);
        }
    }

    private void savePayment(PaymentDto paymentDto, String id, long amountInCents) {
      Payment payment = new Payment();
      payment.setPaymentStatus("Pending");
      payment.setAmount((double) amountInCents / 100); // Stripe için
      payment.setTransactionReference(id); // Stripe intent id veya PayPal order id
      payment.setIsActive(true);
      payment.setUser(userRepository.findById(paymentDto.getUserId()).orElseThrow(() -> new RuntimeException("User not found")));

      String formatName = paymentDto.getPaymentFormatId() != null ? "STRIPE" : "PAYPAL";

      PaymentFormat format = paymentFormatRepository
              .findByName(formatName)
              .orElseThrow(() -> new RuntimeException("Payment format not found"));
      payment.setPaymentFormat(format);

      paymentRepository.save(payment);
  }


    public Payment savePayment(CheckoutDto dto, double total, User user) {
        PaymentFormat format = paymentFormatRepository
                .findByName(dto.getPaymentMethod())
                .orElseThrow(() -> new RuntimeException("Payment format not found"));

        Payment payment = new Payment();
        payment.setPaymentStatus("Pending");
        payment.setAmount(total);
        payment.setTransactionReference(dto.getPaymentIntentId());
        payment.setIsActive(true);
        payment.setUser(user);
        payment.setPaymentFormat(format);

        return paymentRepository.save(payment);
    }
}
