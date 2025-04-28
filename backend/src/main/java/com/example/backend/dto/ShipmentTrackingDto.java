package com.example.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentTrackingDto {
    private Long id;
    private Long orderId;
    private String trackingNumber;
    private String shipmentStatus;
    private String carrier;
    private LocalDate estimatedDeliveryDate;
    private LocalDate deliveredDate;
    private Boolean isActive;
}
