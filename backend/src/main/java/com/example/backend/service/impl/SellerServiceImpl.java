package com.example.backend.service.impl;

import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ISellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements ISellerService {

    private final ProductRepository productRepository;

    @Override
    public void updateProduct(Long productId, ProductDto dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Ürün güncelleme (field'ları kontrol ederek)
        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getStock() != null) product.setStock(dto.getStock());
        if (dto.getMainImageUrl() != null) product.setMainImageUrl(dto.getMainImageUrl());

        productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }
}
