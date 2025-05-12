package com.example.backend.repository;

import com.example.backend.dto.OrderDto;
import com.example.backend.dto.OrderItemDto;
import com.example.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findBySellerId(Long sellerId);
    List<Product> findByIsActiveTrue();
    @org.springframework.data.jpa.repository.Query("SELECT new com.example.backend.dto.OrderDto(o.id, o.orderDate, o.totalAmount, o.status, u.username) " +
       "FROM OrderItem oi JOIN oi.order o JOIN o.user u " +
       "WHERE o.isActive = true AND oi.product.seller.id = :sellerId")
    List<OrderItemDto> getOrdersForSeller(@org.springframework.data.repository.query.Param("sellerId") Long sellerId);
}
