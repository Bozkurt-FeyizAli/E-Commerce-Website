package com.example.backend.repository;

import com.example.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Featured ürünleri filtrelemek için özel sorgu
    List<Product> findByFeaturedTrue();

    List<Product> findByActiveTrue();
}
