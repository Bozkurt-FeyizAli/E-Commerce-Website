package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDto {
    private Long id;
    private Long userId;
    private Long paymentFormatId;
    private String paymentStatus;
    private Double amount;
    private String transactionReference;
    private Boolean isActive;
    private LocalDateTime paymentDate;
}
