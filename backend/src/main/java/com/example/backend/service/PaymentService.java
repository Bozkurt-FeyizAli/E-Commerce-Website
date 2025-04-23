package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public PaymentService(OrderRepository orderRepository, PaymentRepository paymentRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    public Payment payForOrder(String email, Long orderId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Order order = orderRepository.findById(orderId).orElseThrow();

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bu sipariş bu kullanıcıya ait değil!");
        }

        // Ödeme simülasyonu
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalPrice());
        payment.setCreatedAt(LocalDateTime.now());
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setStatus(PaymentStatus.SUCCESS);

        return paymentRepository.save(payment);
    }
}
