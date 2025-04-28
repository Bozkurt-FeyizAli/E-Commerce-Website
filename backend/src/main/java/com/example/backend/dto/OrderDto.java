package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {
    private Long id;
    private Long userId;
    private Long paymentId;
    private String status;
    private Double totalAmount;
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingState;
    private String shippingPostalCode;
    private String shippingCountry;
    private Boolean isActive;
    private LocalDateTime orderDate;
}
