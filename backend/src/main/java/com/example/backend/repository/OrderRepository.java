package com.example.backend.repository;

import com.example.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    @Query("""
SELECT DISTINCT o FROM Order o
LEFT JOIN FETCH o.orderItems oi
LEFT JOIN FETCH oi.product p
LEFT JOIN FETCH p.category
LEFT JOIN FETCH p.seller
WHERE o.id = :id
""")
Optional<Order> findWithItemsAndProducts(@Param("id") Long id);

}
