package com.example.backend.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private Long categoryId;
    private String imageUrl;  // 👈 Cloudinary'den gelen URL!
}
