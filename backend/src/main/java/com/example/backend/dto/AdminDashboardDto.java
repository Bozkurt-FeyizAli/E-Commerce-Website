package com.example.backend.dto;

import java.util.List;

import com.example.backend.entity.Product;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardDto {
    private Long totalUsers;
    private Long totalProducts;
    private Long totalOrders;
    private Double totalRevenue;
    private Long totalProductsSold;
    private List<Product> lowStockProducts;
private List<OrderDto> recentOrders;
private List<ProductDto> topProducts;

}
