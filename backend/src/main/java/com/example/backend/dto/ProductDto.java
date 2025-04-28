package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String mainImageUrl;
    private Double discountPercentage;
    private Double ratingAverage;
    private Long categoryId;
    private Long sellerId;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
