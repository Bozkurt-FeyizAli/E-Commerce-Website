package com.example.backend.controller;

import com.example.backend.dto.AdminDashboardDto;
import com.example.backend.dto.CategoryDto;
import com.example.backend.dto.ComplaintDto;
import com.example.backend.dto.OrderDto;
import com.example.backend.dto.ProductDto;
import com.example.backend.dto.SalesStatsDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.Category;
import com.example.backend.entity.Complaint;
import com.example.backend.entity.Product;
import com.example.backend.service.IAdminService;
import com.example.backend.service.IOrderService;


import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final IAdminService adminService;
    private final IOrderService orderService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboardStats() {
        AdminDashboardDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @PatchMapping("/ban-user/{userId}")
    public ResponseEntity<Void> banUser(@PathVariable Long userId) {
        adminService.banUser(userId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/unban-user/{userId}")
    public ResponseEntity<Void> unbanUser(@PathVariable Long userId) {
        adminService.unbanUser(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete-product/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        adminService.deleteProduct(productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sales-stats")
    public ResponseEntity<List<SalesStatsDto>> getSalesStatsLast7Days() {
        List<SalesStatsDto> stats = adminService.getSalesStatsLast7Days();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orders = orderService.getAllActiveOrders();
        return ResponseEntity.ok(orders);
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<Void> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok().build(); // <--- Fix here
    }

    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok().build(); // <--- Fix here
    }

    @GetMapping("/users")
public ResponseEntity<List<UserDto>> getAllUsers() {
    List<UserDto> users = adminService.getAllUsers();
    return ResponseEntity.ok(users);
}

@DeleteMapping("/users/{userId}")
public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
    adminService.deleteUser(userId);
    return ResponseEntity.ok().build();
}

@PatchMapping("/deactivate-user/{userId}")
public ResponseEntity<Void> deactivateUser(@PathVariable Long userId) {
    adminService.deactivateUser(userId);
    return ResponseEntity.ok().build();
}

@GetMapping("/products")
public ResponseEntity<List<ProductDto>> getAllProducts() {
    return ResponseEntity.ok(adminService.getAllProducts());
}

@GetMapping("/categories")
public ResponseEntity<List<CategoryDto>> getAllCategories() {
    return ResponseEntity.ok(adminService.getAllCategories());
}


@GetMapping("/complaints")
public ResponseEntity<List<ComplaintDto>> getAllComplaints() {
    return ResponseEntity.ok(adminService.getAllComplaints());
}


}
