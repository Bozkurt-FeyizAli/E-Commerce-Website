package com.example.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {
    private Long id;
    private Long orderId;
    private Long productId;
    private Integer quantity;
    private Double priceAtPurchase;
    private Boolean isActive;
}
