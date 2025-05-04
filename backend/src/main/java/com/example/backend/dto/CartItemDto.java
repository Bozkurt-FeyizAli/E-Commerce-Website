package com.example.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDto {
    private Long id;
    private Long cartId;
    private Long productId;
    private Integer quantity;
    private Double priceWhenAdded;
    private Boolean isActive;
    private ProductDto product;
}
