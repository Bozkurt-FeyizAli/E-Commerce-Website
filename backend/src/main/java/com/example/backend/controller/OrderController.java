package com.example.backend.controller;

import com.example.backend.dto.CheckoutDto;
import com.example.backend.dto.OrderDto;
import com.example.backend.dto.PaymentDto;
import com.example.backend.service.IOrderService;
import com.example.backend.service.IPaymentService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final IOrderService orderService;
    private final IPaymentService paymentService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderDto orderDto) {
        OrderDto createdOrder = orderService.createOrder(orderDto);
        return ResponseEntity.ok(createdOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDto> updateOrder(@PathVariable Long id, @RequestBody OrderDto orderDto) {
        OrderDto updatedOrder = orderService.updateOrder(id, orderDto);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllActiveOrders() {
        List<OrderDto> orders = orderService.getAllActiveOrders();
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/payments/create-payment-intent")
@PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
public ResponseEntity<Map<String, String>> createStripeIntent(@RequestBody PaymentDto dto) {
    return ResponseEntity.ok(paymentService.createPaymentIntent(dto));
}

    @GetMapping("/my")
    public ResponseEntity<List<OrderDto>> getMyOrders() {
        List<OrderDto> orders = orderService.getOrdersForCurrentUser();
        return ResponseEntity.ok(orders);
    }
    }
