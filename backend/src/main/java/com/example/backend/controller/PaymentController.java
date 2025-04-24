package com.example.backend.controller;

import com.example.backend.entity.PaymentMethod;
import com.example.backend.service.PaymentMethodService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    private final PaymentMethodService paymentMethodService;

    public PaymentController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @PostMapping("/{orderId}/pay")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PaymentMethod payForOrder(@PathVariable Long orderId,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        return paymentMethodService.payForOrder(userDetails.getUsername(), orderId);
    }
}
