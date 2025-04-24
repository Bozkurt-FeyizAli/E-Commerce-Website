package com.example.backend.service;

import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public void deactivateProduct(Long id) {
      Product product = productRepository.findById(id)
          .orElseThrow(() -> new RuntimeException("Product not found"));

      product.setActive(false);
      productRepository.save(product);
  }

  public Product getById(Long id) {
    return productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product with ID " + id + " not found"));
}


    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue();
    }

    public List<Product> getActiveProducts() {
      return productRepository.findByActiveTrue();
  }

  public Product updateProduct(Long id, Product updatedProduct) {
    Product existing = getById(id);
    existing.setName(updatedProduct.getName());
    existing.setPrice(updatedProduct.getPrice());
    existing.setDescription(updatedProduct.getDescription());
    existing.setImageUrl(updatedProduct.getImageUrl());
    existing.setStock(updatedProduct.getStock());
    existing.setCategory(updatedProduct.getCategory());
    existing.setFeatured(updatedProduct.isFeatured());
    existing.setActive(updatedProduct.isActive());
    return productRepository.save(existing);
}


}
