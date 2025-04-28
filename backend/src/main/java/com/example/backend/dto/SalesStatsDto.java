package com.example.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesStatsDto {
    private LocalDate date;
    private Double totalSales;
}
