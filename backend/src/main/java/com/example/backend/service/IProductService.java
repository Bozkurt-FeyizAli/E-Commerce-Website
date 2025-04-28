package com.example.backend.service;

import com.example.backend.dto.ProductDto;

import java.util.List;

public interface IProductService {

    ProductDto createProduct(ProductDto productDto);

    ProductDto updateProduct(Long id, ProductDto productDto);

    void deleteProduct(Long id);

    ProductDto getProductById(Long id);

    List<ProductDto> getAllActiveProducts();
}
