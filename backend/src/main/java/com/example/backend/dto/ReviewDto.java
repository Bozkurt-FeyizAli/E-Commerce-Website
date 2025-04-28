package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {
    private Long id;
    private Long userId;
    private Long productId;
    private Integer rating;
    private String comment;
    private Boolean isActive;
    private LocalDateTime reviewDate;
}
