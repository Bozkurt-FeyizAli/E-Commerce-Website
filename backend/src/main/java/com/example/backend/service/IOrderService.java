package com.example.backend.service;

import com.example.backend.dto.OrderDto;

import java.util.List;

public interface IOrderService {

    OrderDto createOrder(OrderDto orderDto);

    OrderDto updateOrder(Long id, OrderDto orderDto);

    void deleteOrder(Long id);

    OrderDto getOrderById(Long id);

    List<OrderDto> getAllActiveOrders();
}
