package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintDto {
    private Long id;
    private Long userId;
    private Long orderId;
    private String complaintType;
    private String description;
    private String status;
    private String resolutionComment;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
