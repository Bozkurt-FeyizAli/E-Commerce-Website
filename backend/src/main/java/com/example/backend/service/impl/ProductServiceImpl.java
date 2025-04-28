package com.example.backend.service.impl;

import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Category;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.IProductService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductDto createProduct(ProductDto dto) {
        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .mainImageUrl(dto.getMainImageUrl())
                .discountPercentage(dto.getDiscountPercentage())
                .ratingAverage(0.0)
                .isActive(true)
                .category(categoryRepository.findById(dto.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found")))
                .seller(userRepository.findById(dto.getSellerId()).orElseThrow(() -> new RuntimeException("Seller not found")))
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct);
    }

    @Override
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getStock() != null) product.setStock(dto.getStock());
        if (dto.getMainImageUrl() != null) product.setMainImageUrl(dto.getMainImageUrl());
        if (dto.getDiscountPercentage() != null) product.setDiscountPercentage(dto.getDiscountPercentage());

        return mapToDto(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setIsActive(false);
        productRepository.save(product);
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getIsActive()) throw new RuntimeException("Product is inactive.");

        return mapToDto(product);
    }

    @Override
    public List<ProductDto> getAllActiveProducts() {
        List<Product> products = productRepository.findByIsActiveTrue();
        return products.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .mainImageUrl(product.getMainImageUrl())
                .discountPercentage(product.getDiscountPercentage())
                .ratingAverage(product.getRatingAverage())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .sellerId(product.getSeller() != null ? product.getSeller().getId() : null)
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
