package com.example.backend.service;

import com.example.backend.dto.ProductDto;

public interface ISellerService {
    void updateProduct(Long productId, ProductDto dto);
    void deleteProduct(Long productId);
}
