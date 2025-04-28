package com.example.backend.service;

public interface IAdminManagementService {
    void banUser(Long userId);
    void unbanUser(Long userId);
    void deleteProduct(Long productId);
    void cancelOrder(Long orderId);
}
