package com.example.backend.service.impl;

import com.example.backend.dto.CheckoutDto;
import com.example.backend.dto.OrderDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.Cart;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderItem;
import com.example.backend.entity.Payment;
import com.example.backend.entity.User;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.ProductRepository;
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
    private final PaymentRepository paymentRepository;
    private final CartServiceImpl cartService;
    private final CartRepository cartRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentServiceImpl paymentService;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

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
                .user(userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found6")))
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
              .user(order.getUser() != null ? mapUserToDto(order.getUser()) : null) // 👈 ekle
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

  private UserDto mapUserToDto(User user) {
    return UserDto.builder()
        .id(user.getId())
        .email(user.getEmail())
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .username(user.getUsername())
        .build();
}




    @Override
    @Transactional
    public OrderDto createOrderFromCart(CheckoutDto dto) {
      User user = userRepository.findById(dto.getUserId())
          .orElseThrow(() -> new RuntimeException("User not found"));

      Cart cart = cartRepository.findByUserId(user.getId())
          .orElseThrow(() -> new RuntimeException("Cart not found"));

      if (cart.getCartItems().isEmpty())
        throw new RuntimeException("Cart is empty");

      double total = cart.getCartItems().stream()
          .mapToDouble(i -> i.getPriceWhenAdded() * i.getQuantity()).sum();

      // ⭐ Kapıda Ödeme ⇒ payment=null
      Payment payment = null;
      if (!"COD".equalsIgnoreCase(dto.getPaymentMethod())) {
        payment = paymentService.savePayment(dto, total, user);
      }

      Order order = Order.builder()
          .user(user)
          .payment(payment)
          .status("PENDING")
          .totalAmount(total)
          .shippingAddressLine(dto.getShippingAddressLine())
          .shippingCity(dto.getShippingCity())
          .shippingState(dto.getShippingState())
          .shippingPostalCode(dto.getShippingPostalCode())
          .shippingCountry(dto.getShippingCountry())
          .isActive(true)
          .build();

      orderRepository.save(order);

      cart.getCartItems().forEach(ci -> {
        // ⭐ OrderItem oluştur
        OrderItem oi = OrderItem.builder()
            .order(order)
            .product(ci.getProduct())
            .quantity(ci.getQuantity())
            .priceAtPurchase(ci.getPriceWhenAdded())
            .isActive(true)
            .build();
        orderItemRepository.save(oi);

        // ⭐ Ürün stoğundan düş
        var product = ci.getProduct();
        int newStock = product.getStock() - ci.getQuantity();
        if (newStock < 0) throw new RuntimeException("Stok yetersiz: " + product.getName());
        product.setStock(newStock);
        productRepository.save(product); // 🔁 Stok güncelleme

        // ⭐ Sepet öğesini devre dışı bırak
        ci.setIsActive(false);
        cartItemRepository.save(ci); // 🔁 cart değil, tek tek item güncellenir
    });
      cartService.emptyCart(cart.getId());   // sepeti temizle

      return mapToDto(order);
    }

    @Override
public void updateOrderStatus(Long orderId, String newStatus) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));
    order.setStatus(newStatus.toUpperCase());
    orderRepository.save(order);
}

    @Override
    public List<OrderDto> getOrdersForCurrentUser() {
        User user = userRepository.findById(1L) 
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findAll()
                .stream()
                .filter(order -> order.getUser().getId().equals(user.getId()) && order.getIsActive())
                .collect(Collectors.toList());

        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

}
