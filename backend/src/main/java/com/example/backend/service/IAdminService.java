package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.AdminDashboardDto;
import com.example.backend.dto.CategoryDto;
import com.example.backend.dto.ComplaintDto;
import com.example.backend.dto.ProductDto;
import com.example.backend.dto.SalesStatsDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.Category;
import com.example.backend.entity.Complaint;
import com.example.backend.entity.Product;

public interface IAdminService {
    AdminDashboardDto getDashboardStats();
    List<UserDto> getAllUsers();
void deleteUser(Long userId);
void banUser(Long userId);
void unbanUser(Long userId);

    void deleteProduct(Long productId);
    void cancelOrder(Long orderId);
    List<SalesStatsDto> getSalesStatsLast7Days();
    void deactivateUser(Long userId);
  public List<ProductDto> getAllProducts();
public List<CategoryDto> getAllCategories();
public List<ComplaintDto> getAllComplaints();
public void updateComplaintStatus(Long complaintId, String status, String resolutionComment);


}
