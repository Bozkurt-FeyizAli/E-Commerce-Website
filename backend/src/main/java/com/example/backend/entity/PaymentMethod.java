package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "payment_format_id")  // 🔗 foreign key bağlantısı
    private PaymentFormat paymentFormat;

    private String creditCardNumber;
    private String cvc;
    private String name;
    private LocalDate expiryDate;

    private boolean active;
    private String transactionId;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;


    public void setAmount(Double totalPrice) {
        this.order.setTotalPrice(totalPrice);
    }

    public void setCreatedAt(LocalDateTime now) {
        this.order.setCreatedAt(now);
    }

    public void setUser(Order order) {
        this.order.setUser(order.getUser());
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setTransactionId(String string) {
        this.transactionId = string;
    }

    public void setStatus(PaymentStatus success) {
       this.order.setStatus(success);
    }

    public void setUser(User user2) {
        this.user = user2;
    }
}
