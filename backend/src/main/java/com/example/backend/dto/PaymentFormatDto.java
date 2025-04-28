package com.example.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentFormatDto {
    private Long id;
    private String name;
    private Boolean isActive;
}
