package com.example.backend.controller;

import com.example.backend.dto.AdminDashboardDto;
import com.example.backend.dto.SalesStatsDto;
import com.example.backend.service.IAdminService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final IAdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboardStats() {
        AdminDashboardDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @PatchMapping("/ban-user/{userId}")
public ResponseEntity<String> banUser(@PathVariable Long userId) {
    adminService.banUser(userId);
    return ResponseEntity.ok("User banned successfully.");
}

@PatchMapping("/unban-user/{userId}")
public ResponseEntity<String> unbanUser(@PathVariable Long userId) {
    adminService.unbanUser(userId);
    return ResponseEntity.ok("User unbanned successfully.");
}

@DeleteMapping("/delete-product/{productId}")
public ResponseEntity<String> deleteProduct(@PathVariable Long productId) {
    adminService.deleteProduct(productId);
    return ResponseEntity.ok("Product deleted successfully.");
}

@GetMapping("/sales-stats")
public ResponseEntity<List<SalesStatsDto>> getSalesStatsLast7Days() {
    List<SalesStatsDto> stats = adminService.getSalesStatsLast7Days();
    return ResponseEntity.ok(stats);
}


}
