package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false, unique = false)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;

    @Column(name = "is_active", nullable = false)
    private Boolean active = false;
}
