package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private PaymentMethod paymentMethod;

    public void setItems(List<OrderItem> orderItems2) {
      this.orderItems = orderItems2;
      for (OrderItem orderItem : orderItems2) {
          orderItem.setOrder(this);
      }
    }

    public void setStatus(PaymentStatus success) {
        this.status = OrderStatus.DELIVERED;
    }

    public void setStatus(OrderStatus pending) {
        this.status = OrderStatus.PENDING;
    }
}
