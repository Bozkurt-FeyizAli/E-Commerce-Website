package com.example.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CheckoutDto {
    private Long userId;
    private String paymentMethod;  // COD | STRIPE | PAYPAL
    private String paymentIntentId; // Stripe/PayPal için
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingState;
    private String shippingPostalCode;
    private String shippingCountry;
}
