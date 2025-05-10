package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.ProductDto;

public interface ISellerService {
    void updateProduct(Long productId, ProductDto dto);
    void deleteProduct(Long productId);
    void addProduct(ProductDto dto);
    List<ProductDto> getProductsForCurrentSeller();
}
