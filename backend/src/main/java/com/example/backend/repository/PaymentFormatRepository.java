package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.PaymentFormat;

public interface PaymentFormatRepository extends JpaRepository<PaymentFormat, Long> {}
