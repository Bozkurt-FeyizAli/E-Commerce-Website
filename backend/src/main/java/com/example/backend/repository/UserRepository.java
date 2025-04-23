package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Allows login by email
    Optional<User> findByEmail(String email);

    // Optional: to check if email already exists (for registration)
    boolean existsByEmail(String email);
}
