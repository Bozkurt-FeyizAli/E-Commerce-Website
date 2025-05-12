package com.example.backend.service.impl;

import com.example.backend.dto.OrderDto;
import com.example.backend.dto.OrderItemDto;
import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.service.ISellerService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements ISellerService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void addProduct(ProductDto dto) {
        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .mainImageUrl(dto.getMainImageUrl())
                .discountPercentage(dto.getDiscountPercentage() != null ? dto.getDiscountPercentage() : 0.0)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        product.setSeller(userRepository.findById(dto.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found")));

        product.setCategory(categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found")));

        productRepository.save(product);
    }

    @Override
    public void updateProduct(Long productId, ProductDto dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

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

    @Override
    public List<ProductDto> getProductsForCurrentSeller() {
        Long currentSellerId = getCurrentSellerId();
        List<Product> products = productRepository.findBySellerId(currentSellerId);
        return mapToDtoList(products);
    }


    public List<ProductDto> getProductsBySellerId(Long sellerId) {
        List<Product> products = productRepository.findBySellerId(sellerId);
        return mapToDtoList(products);
    }

    private Long getCurrentSellerId() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
        throw new RuntimeException("No authenticated seller found");
    }



    Object principal = authentication.getPrincipal();
System.out.println("🔥 Principal type: " + principal.getClass());
System.out.println("🔥 Principal value: " + principal);


    if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated seller not found"))
                .getId();
    } else if (principal instanceof com.example.backend.entity.User user) {
        return user.getId();
    }

    throw new RuntimeException("Authenticated seller information is not available");
}


    private List<ProductDto> mapToDtoList(List<Product> products) {
        return products.stream()
                .map(product -> ProductDto.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .description(product.getDescription())
                        .price(product.getPrice())
                        .stock(product.getStock())
                        .mainImageUrl(product.getMainImageUrl())
                        .discountPercentage(product.getDiscountPercentage())
                        .sellerId(product.getSeller().getId())
                        .categoryId(product.getCategory().getId())
                        .createdAt(product.getCreatedAt())
                        .isActive(product.getIsActive())
                        .build())
                .toList();
    }

    @Override
    public List<OrderItemDto> getOrdersForCurrentSeller() {
        Long currentSellerId = getCurrentSellerId();
        List<OrderItemDto> orders = productRepository.getOrdersForSeller(currentSellerId);
        return orders;
    }
}
