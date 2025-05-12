package com.example.backend.service.impl;

import com.example.backend.dto.AdminDashboardDto;
import com.example.backend.dto.CategoryDto;
import com.example.backend.dto.ComplaintDto;
import com.example.backend.dto.ProductDto;
import com.example.backend.dto.SalesStatsDto;
import com.example.backend.dto.UserDto;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ComplaintRepository;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.service.IAdminService;
import com.example.backend.entity.Category;
import com.example.backend.entity.Complaint;
import com.example.backend.entity.Order;
import com.example.backend.entity.Product;

import lombok.RequiredArgsConstructor;

import com.example.backend.entity.User;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements IAdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ComplaintRepository complaintRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public AdminDashboardDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        // Toplam gelir hesaplama (sadece tamamlanan siparişler)
        double totalRevenue = orderRepository.findAll().stream()
                .filter(order -> "Completed".equalsIgnoreCase(order.getStatus()))
                .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                .sum();

        // Toplam satılan ürün adedi hesaplama (order_items tablosundan)
        long totalProductsSold = orderItemRepository.findAll().stream()
                .mapToLong(item -> item.getQuantity() != null ? item.getQuantity() : 0)
                .sum();

        return AdminDashboardDto.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .totalProductsSold(totalProductsSold)
                .build();
    }


    @Override
    public void banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found9"));
        user.setIsBanned(true);
        userRepository.save(user);
    }

    @Override
    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found8"));
        user.setIsBanned(false);
        userRepository.save(user);
    }

    @Override
public void deleteProduct(Long productId) {
    productRepository.deleteById(productId);
}

@Override
public void cancelOrder(Long orderId) {
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    order.setStatus("Cancelled");
    orderRepository.save(order);
}

@Override
public List<SalesStatsDto> getSalesStatsLast7Days() {
    LocalDate today = LocalDate.now();
    LocalDate sevenDaysAgo = today.minusDays(6);

    // Bugün dahil son 7 gün
    List<Order> orders = orderRepository.findAll().stream()
            .filter(order -> order.getOrderDate() != null)
            .filter(order -> !order.getOrderDate().toLocalDate().isBefore(sevenDaysAgo))
            .filter(order -> "Completed".equalsIgnoreCase(order.getStatus()))
            .toList();

    Map<LocalDate, Double> salesMap = new HashMap<>();

    // Başlangıçta 0.0 değerlerle tüm günleri hazırla
    for (int i = 0; i < 7; i++) {
        LocalDate date = sevenDaysAgo.plusDays(i);
        salesMap.put(date, 0.0);
    }

    // Siparişleri günlere göre grupla
    for (Order order : orders) {
        LocalDate date = order.getOrderDate().toLocalDate();
        salesMap.put(date, salesMap.getOrDefault(date, 0.0) + order.getTotalAmount());
    }

    // DTO'ya çevir
    return salesMap.entrySet().stream()
            .map(entry -> new SalesStatsDto(entry.getKey(), entry.getValue()))
            .sorted(Comparator.comparing(SalesStatsDto::getDate))
            .toList();
}


@Override
public List<UserDto> getAllUsers() {
    List<User> users = userRepository.findAll();
    return users.stream()
            .map(user -> UserDto.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .isBanned(user.getIsBanned())
                    .isActive(user.getIsActive())
                    .build())
            .toList();
}


@Override
public void deleteUser(Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    user.setIsActive(false);
    userRepository.save(user);
}


@Override
public void deactivateUser(Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    user.setIsActive(false);
    userRepository.save(user);
}

@Override
public List<ProductDto> getAllProducts() {
    return productRepository.findAll().stream()
        .map(product -> ProductDto.builder()
            .id(product.getId())
            .name(product.getName())
            .description(product.getDescription())
            .price(product.getPrice())
            .stock(product.getStock())
            .mainImageUrl(product.getMainImageUrl())
            .discountPercentage(product.getDiscountPercentage())
            .ratingAverage(product.getRatingAverage())
            .isActive(product.getIsActive())
            .createdAt(product.getCreatedAt())
            .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
            .sellerId(product.getSeller() != null ? product.getSeller().getId() : null)
            .build())
        .toList();
}


@Override
public List<CategoryDto> getAllCategories() {
    return categoryRepository.findAll().stream()
        .map(category -> CategoryDto.builder()
            .id(category.getId())
            .name(category.getName())
            .description(category.getDescription())
            .imageUrl(category.getImageUrl())
            .isActive(category.getIsActive())
            .productCount(category.getProducts() != null ? category.getProducts().size() : 0)
            .build())
        .toList();
}


@Override
public List<ComplaintDto> getAllComplaints() {
    return complaintRepository.findAll().stream()
        .map(complaint -> ComplaintDto.builder()
            .id(complaint.getId())
            .userId(complaint.getUser() != null ? complaint.getUser().getId() : null)
            .orderId(complaint.getOrder() != null ? complaint.getOrder().getId() : null)
            .description(complaint.getDescription())
            .status(complaint.getStatus())
            .resolutionComment(complaint.getResolutionComment())
            .createdAt(complaint.getCreatedAt())
            .build())
        .toList();
}

@Override
public void updateComplaintStatus(Long complaintId, String status, String resolutionComment) {
    Complaint complaint = complaintRepository.findById(complaintId)
        .orElseThrow(() -> new RuntimeException("Complaint not found"));

    complaint.setStatus(status);
    complaint.setResolutionComment(resolutionComment);
    complaintRepository.save(complaint);
}

}
