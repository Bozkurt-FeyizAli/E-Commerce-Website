package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    public Order createOrder(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Cart cart = cartRepository.findByUser(user).orElseThrow();

        if (cart.getItems().isEmpty()) throw new RuntimeException("Sepet boş");

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        double total = 0;

List<OrderItem> orderItems = new ArrayList<>();
for (CartItem cartItem : cart.getItems()) {
    OrderItem item = new OrderItem();
    item.setProduct(cartItem.getProduct());
    item.setQuantity(cartItem.getQuantity());
    item.setPriceAtPurchase(cartItem.getPriceAtAddition());
    item.setOrder(order);

    total += item.getQuantity() * item.getPriceAtPurchase();
    orderItems.add(item);
}


        order.setItems(orderItems);
        order.setTotalPrice(total);

        Order savedOrder = orderRepository.save(order);
        if (savedOrder.getId() != null) {
          cart.getItems().clear();
          cartRepository.save(cart);
      }
        return savedOrder;
    }

    public List<Order> getOrders(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return orderRepository.findByUser(user);
    }
}
