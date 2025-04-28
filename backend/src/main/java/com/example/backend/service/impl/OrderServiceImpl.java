package com.example.backend.service.impl;

import com.example.backend.dto.OrderDto;
import com.example.backend.entity.Order;
import com.example.backend.entity.Payment;
import com.example.backend.entity.User;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.IOrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements IOrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public OrderDto createOrder(OrderDto dto) {
        Order order = Order.builder()
                .status(dto.getStatus() != null ? dto.getStatus() : "Pending")
                .totalAmount(dto.getTotalAmount())
                .shippingAddressLine(dto.getShippingAddressLine())
                .shippingCity(dto.getShippingCity())
                .shippingState(dto.getShippingState())
                .shippingPostalCode(dto.getShippingPostalCode())
                .shippingCountry(dto.getShippingCountry())
                .isActive(true)
                .user(userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found")))
                .payment(dto.getPaymentId() != null ? paymentRepository.findById(dto.getPaymentId()).orElse(null) : null)
                .build();

        Order savedOrder = orderRepository.save(order);
        return mapToDto(savedOrder);
    }

    @Override
    public OrderDto updateOrder(Long id, OrderDto dto) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (dto.getStatus() != null) order.setStatus(dto.getStatus());
        if (dto.getTotalAmount() != null) order.setTotalAmount(dto.getTotalAmount());
        if (dto.getShippingAddressLine() != null) order.setShippingAddressLine(dto.getShippingAddressLine());
        if (dto.getShippingCity() != null) order.setShippingCity(dto.getShippingCity());
        if (dto.getShippingState() != null) order.setShippingState(dto.getShippingState());
        if (dto.getShippingPostalCode() != null) order.setShippingPostalCode(dto.getShippingPostalCode());
        if (dto.getShippingCountry() != null) order.setShippingCountry(dto.getShippingCountry());

        return mapToDto(orderRepository.save(order));
    }

    @Override
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setIsActive(false);
        orderRepository.save(order);
    }

    @Override
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getIsActive()) throw new RuntimeException("Order is inactive.");

        return mapToDto(order);
    }

    @Override
    public List<OrderDto> getAllActiveOrders() {
        List<Order> orders = orderRepository.findAll()
                .stream()
                .filter(Order::getIsActive)
                .collect(Collectors.toList());

        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private OrderDto mapToDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .paymentId(order.getPayment() != null ? order.getPayment().getId() : null)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddressLine(order.getShippingAddressLine())
                .shippingCity(order.getShippingCity())
                .shippingState(order.getShippingState())
                .shippingPostalCode(order.getShippingPostalCode())
                .shippingCountry(order.getShippingCountry())
                .isActive(order.getIsActive())
                .orderDate(order.getOrderDate())
                .build();
    }
}
