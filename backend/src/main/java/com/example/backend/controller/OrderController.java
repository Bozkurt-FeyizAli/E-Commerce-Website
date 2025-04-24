package com.example.backend.controller;

import com.example.backend.entity.Order;
import com.example.backend.service.OrderService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public Order createOrder(@AuthenticationPrincipal UserDetails userDetails) {
        return orderService.createOrder(userDetails.getUsername());
    }

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Order> getOrders(@AuthenticationPrincipal UserDetails userDetails) {
        return orderService.getOrders(userDetails.getUsername());
    }
}
