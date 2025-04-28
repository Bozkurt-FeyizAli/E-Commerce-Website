package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductFilter {

    private Double minPrice;
    private Double maxPrice;

    private List<Long> categoryIds;

    private List<Long> sellerIds;

    private Boolean inStockOnly; // true: stok > 0

    private Boolean discountOnly; // true: %0'dan büyük discount olanlar

    private Boolean isActive; // aktif ürünler

    private LocalDateTime createdAfter;
    private LocalDateTime createdBefore;
}
