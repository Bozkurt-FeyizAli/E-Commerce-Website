package com.example.backend.service;

import com.example.backend.dto.PaymentDto;

import java.util.List;
import java.util.Map;

public interface IPaymentService {

    PaymentDto createPayment(PaymentDto paymentDto);

    PaymentDto updatePayment(Long id, PaymentDto paymentDto);

    void deletePayment(Long id);

    PaymentDto getPaymentById(Long id);

    List<PaymentDto> getAllActivePayments();

    Map<String, String> createPaymentIntent(PaymentDto paymentDto);
}
