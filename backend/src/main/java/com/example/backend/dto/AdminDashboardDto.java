package com.example.backend.dto;

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
}
