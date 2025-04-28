package com.example.backend.controller;

import lombok.RequiredArgsConstructor;
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

}
