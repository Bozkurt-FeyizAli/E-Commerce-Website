package com.example.backend.repository;

import com.example.backend.entity.ShipmentTracking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentTrackingRepository extends JpaRepository<ShipmentTracking, Long> {
}
