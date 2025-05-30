package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_formats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentFormat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Stripe, PayPal vb.

    @Column(nullable = false)
    private Boolean isActive = true;
}
