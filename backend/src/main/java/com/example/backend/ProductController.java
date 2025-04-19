package com.example.backend;
import java.util.*;

import org.springframework.web.bind.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@RestController
@RequestMapping("/api/products")
public class ProductController {

    // Fake ürün listesi (RAM'de tutulur)
    private List<Product> products = new ArrayList<>(Arrays.asList(
        new Product(1L, "Laptop", 999.99, "Elektronik"),
        new Product(2L, "Kitap", 19.99, "Kırtasiye")
    ));

    @GetMapping
    public List<Product> getAllProducts() {
        return products;
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        products.add(product);
        return product;
    }
}

// Basit Product modeli (Lombok ile)
@Data
@AllArgsConstructor
@NoArgsConstructor
class Product {
    private Long id;
    private String name;
    private double price;
    private String category;
}
