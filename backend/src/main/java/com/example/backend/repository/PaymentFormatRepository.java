package com.example.backend.repository;

import com.example.backend.entity.PaymentFormat;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentFormatRepository extends JpaRepository<PaymentFormat, Long> {
  Optional<PaymentFormat> findByName(String name);
}
