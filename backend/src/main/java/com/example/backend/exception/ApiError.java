package com.example.backend.exception;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiError {
    private int statusCode;
    private String message;
    private LocalDateTime timestamp;
}
