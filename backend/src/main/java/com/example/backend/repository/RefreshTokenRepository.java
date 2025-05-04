package com.example.backend.repository;

import com.example.backend.entity.RefreshToken;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUserId(Long userId);

    @Transactional
    @Modifying
    @Query(value = "UPDATE refresh_tokens rt JOIN users u ON u.id = rt.user_id SET rt.is_active = false WHERE u.id = :userId", nativeQuery = true)
    void inActivateByUser(@Param("userId") Long userId);

    @Transactional
    @Modifying
    @Query(value = "UPDATE refresh_tokens rt JOIN users u ON u.id = rt.user_id SET rt.is_active = false WHERE u.email = :email", nativeQuery = true)
    void inActivateByUserEmail(@Param("email") String email);




}
