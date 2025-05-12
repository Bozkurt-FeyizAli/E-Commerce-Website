package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {

  public OrderDto(Long id, LocalDateTime orderDate, Double totalAmount, String status, String username) {
    this.id = id;
    this.orderDate = orderDate;
    this.totalAmount = totalAmount;
    this.status = status;

    this.user = new UserDto(); // user nesnesi boş olarak yaratılıyor
    this.user.setUsername(username);
}


    private Long id;
    private Long userId;
    private Long paymentId;
    private String status;
    private Double totalAmount;
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingState;
    private String shippingPostalCode;
    private String shippingCountry;
    private Boolean isActive;
    private LocalDateTime orderDate;
    private UserDto user;
    private List<OrderItemDto> orderItems;

}
