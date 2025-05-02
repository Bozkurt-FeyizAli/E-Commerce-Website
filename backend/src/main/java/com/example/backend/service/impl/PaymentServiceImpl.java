package com.example.backend.service.impl;

import com.example.backend.dto.PaymentDto;
import com.example.backend.entity.Payment;
import com.example.backend.entity.PaymentFormat;
import com.example.backend.entity.User;
import com.example.backend.repository.PaymentFormatRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.IPaymentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final PaymentFormatRepository paymentFormatRepository;

    @Override
    public PaymentDto createPayment(PaymentDto dto) {
        Payment payment = Payment.builder()
                .paymentStatus(dto.getPaymentStatus() != null ? dto.getPaymentStatus() : "Pending")
                .amount(dto.getAmount())
                .transactionReference(dto.getTransactionReference())
                .isActive(true)
                .user(userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found5")))
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
}
