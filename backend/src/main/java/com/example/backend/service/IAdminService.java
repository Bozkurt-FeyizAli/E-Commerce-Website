package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.AdminDashboardDto;
import com.example.backend.dto.SalesStatsDto;

public interface IAdminService {
    AdminDashboardDto getDashboardStats();
    void banUser(Long userId);
    void unbanUser(Long userId);
    void deleteProduct(Long productId);
    void cancelOrder(Long orderId);
    List<SalesStatsDto> getSalesStatsLast7Days();

}
