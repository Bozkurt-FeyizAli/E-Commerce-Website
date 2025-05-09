package com.example.backend.controller;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.ProductDto;
import com.example.backend.service.ISellerService;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {
    private final ISellerService sellerService;


    @GetMapping("/my-products")
    public ResponseEntity<String> getMyProducts() {
        return ResponseEntity.ok("Here are your products (Seller View).");
    }

    @GetMapping("/my-orders")
    public ResponseEntity<String> getMyOrders() {
        return ResponseEntity.ok("Here are your orders (Seller View).");
    }

    @PutMapping("/update-product/{productId}")
public ResponseEntity<String> updateOwnProduct(@PathVariable Long productId, @RequestBody ProductDto productDto) {
    sellerService.updateProduct(productId, productDto);
    return ResponseEntity.ok("Product updated successfully.");
}

@DeleteMapping("/delete-product/{productId}")
public ResponseEntity<String> deleteOwnProduct(@PathVariable Long productId) {
    sellerService.deleteProduct(productId);
    return ResponseEntity.ok("Product deleted successfully.");
}

@PostMapping("/products")
public ResponseEntity<Map<String, String>> addProduct(@RequestBody ProductDto dto) {
    sellerService.addProduct(dto);
    Map<String, String> response = new HashMap<>();
    response.put("message", "Product added successfully.");
    return ResponseEntity.ok(response);
}


@GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> data = new HashMap<>();
        data.put("productCount", 15);     // Dummy data, veritabanından al
        data.put("orderCount", 20);
        data.put("paymentCount", 12);
        data.put("complaintCount", 3);

        return ResponseEntity.ok(data);
    }


}
