package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDto {
    private Long id;
    private Long paymentId;
    private String transactionType;
    private String transactionStatus;
    private Double transactionAmount;
    private String gatewayResponse;
    private Boolean isActive;
    private LocalDateTime transactionDate;
}
