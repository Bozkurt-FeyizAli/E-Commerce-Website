package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Contract;

public interface ContractRepository extends JpaRepository<Contract, Long> {
}
