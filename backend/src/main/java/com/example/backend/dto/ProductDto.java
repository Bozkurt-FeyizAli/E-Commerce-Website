package com.example.backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {

    private Long id;

    @NotBlank(message = "Product name is required.")
    private String name;

    private String description;

    @NotNull(message = "Price is required.")
    @Positive(message = "Price must be positive.")
    private Double price;

    @NotNull(message = "Stock is required.")
    @Min(value = 0, message = "Stock cannot be negative.")
    private Integer stock;

    private String mainImageUrl;

    private Double discountPercentage;
    private Double ratingAverage;

    @NotNull(message = "Category ID is required.")
    private Long categoryId;

    @NotNull(message = "Seller ID is required.")
    private Long sellerId;

    private Boolean isActive;
    private LocalDateTime createdAt;
}
