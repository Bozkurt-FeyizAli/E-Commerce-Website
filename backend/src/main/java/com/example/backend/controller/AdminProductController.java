package com.example.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.backend.entity.Product;
import com.example.backend.service.ProductService;

@RestController
@RequestMapping("/admin/products")
@CrossOrigin(origins = "http://localhost:4200") // frontend erişimi için
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // sadece admin kullanıcıları erişebilir
    public Product addProduct(@RequestBody Product product) {
        return productService.save(product);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deactivateProduct(@PathVariable Long id) {
        productService.deactivateProduct(id);
    }
}
