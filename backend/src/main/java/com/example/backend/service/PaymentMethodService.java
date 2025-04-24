package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentMethodService {

    private final OrderRepository orderRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final UserRepository userRepository;
    private final PaymentFormatRepository paymentFormatRepository;

    public PaymentMethodService(OrderRepository orderRepository, PaymentMethodRepository paymentMethodRepository, UserRepository userRepository, PaymentFormatRepository paymentFormatRepository) {
        this.orderRepository = orderRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.userRepository = userRepository;
        this.paymentFormatRepository=paymentFormatRepository;
    }

    public PaymentMethod payForOrder(String email, Long orderId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Order order = orderRepository.findById(orderId).orElseThrow();

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bu sipariş bu kullanıcıya ait değil!");
        }

        // Ödeme simülasyonu
        PaymentMethod paymentMethod = new PaymentMethod();
        paymentMethod.setOrder(order);
        paymentMethod.setAmount(order.getTotalPrice());
        paymentMethod.setCreatedAt(LocalDateTime.now());
        paymentMethod.setTransactionId(UUID.randomUUID().toString());
        paymentMethod.setStatus(PaymentStatus.SUCCESS);

        return paymentMethodRepository.save(paymentMethod);
    }

    public PaymentMethod addPaymentMethod(String email, Long formatId, PaymentMethod data) {
      User user = userRepository.findByEmail(email).orElseThrow();
      PaymentFormat format = paymentFormatRepository.findById(formatId).orElseThrow();

      data.setUser(user);
      data.setPaymentFormat(format);
      data.setActive(true);

      return paymentMethodRepository.save(data);
  }
}
