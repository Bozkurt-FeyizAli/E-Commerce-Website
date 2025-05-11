package com.example.backend.service.impl;

import com.example.backend.dto.CheckoutDto;
import com.example.backend.dto.OrderDto;
import com.example.backend.dto.OrderItemDto;
import com.example.backend.dto.ProductDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.Cart;
import com.example.backend.entity.CartItem;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderItem;
import com.example.backend.entity.Payment;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.IOrderService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    @Transactional
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

      cartRepository.findByUserId(dto.getUserId()).ifPresent(cart -> {
        System.out.println("🛒 Cart ID: " + cart.getId());

        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        System.out.println("🛍️ Found cart items: " + items.size());

        for (CartItem ci : items) {
          // OrderItem tablosuna kayıt et
          OrderItem orderItem = OrderItem.builder()
              .order(savedOrder)
              .product(ci.getProduct())
              .quantity(ci.getQuantity())
              .priceAtPurchase(ci.getPriceWhenAdded())
              .isActive(true)
              .build();
          orderItemRepository.save(orderItem);

          System.out.println("➡️ Updating cart item id: " + ci.getId());
          ci.setIsActive(false);
          cartItemRepository.save(ci);
        }
      });


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
    System.out.println("🔍 orderItems size: " + (order.getOrderItems() != null ? order.getOrderItems().size() : "null"));
    return OrderDto.builder()
      .id(order.getId())
      .userId(order.getUser().getId())
      .paymentId(order.getPayment() != null ? order.getPayment().getId() : null)
      .status(order.getStatus())
      .totalAmount(order.getTotalAmount())
      .shippingAddressLine(order.getShippingAddressLine())
      .shippingCity(order.getShippingCity())
      .shippingState(order.getShippingState())
      .shippingPostalCode(order.getShippingPostalCode())
      .shippingCountry(order.getShippingCountry())
      .orderDate(order.getOrderDate())
      .isActive(order.getIsActive())
      .user(mapUserToDto(order.getUser()))
      .orderItems(
        order.getOrderItems() != null
          ? order.getOrderItems().stream()
            .map(this::mapOrderItemToDto)
            .collect(Collectors.toList())
          : new ArrayList<>()
      )
      .build();
}



private OrderItemDto mapOrderItemToDto(OrderItem item) {
  Product product = item.getProduct();

  ProductDto productDto = null;
  if (product != null) {
      Long categoryId = null;
      if (product.getCategory() != null) {
          categoryId = product.getCategory().getId();
      }

      Long sellerId = null;
      if (product.getSeller() != null) {
          sellerId = product.getSeller().getId();
      }

      productDto = ProductDto.builder()
          .id(product.getId())
          .name(product.getName())
          .mainImageUrl(product.getMainImageUrl())
          .price(product.getPrice())
          .stock(product.getStock())
          .discountPercentage(product.getDiscountPercentage())
          .ratingAverage(product.getRatingAverage())
          .categoryId(categoryId)
          .sellerId(sellerId)
          .build();
  }

  return OrderItemDto.builder()
      .id(item.getId())
      .orderId(item.getOrder().getId())
      .productId(product != null ? product.getId() : null)
      .quantity(item.getQuantity())
      .priceAtPurchase(item.getPriceAtPurchase())
      .isActive(item.getIsActive())
      .product(productDto)
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

    if (cart.getCartItems().isEmpty()) {
        throw new RuntimeException("Cart is empty");
    }

    double total = cart.getCartItems().stream()
        .mapToDouble(i -> i.getPriceWhenAdded() * i.getQuantity())
        .sum();

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

    // İlk önce order'ı kaydet
    orderRepository.save(order);

    // OrderItems listesi
    List<OrderItem> orderItems = cart.getCartItems().stream().map(ci -> {
        // Stok güncelle
        Product product = ci.getProduct();
        int newStock = product.getStock() - ci.getQuantity();
        if (newStock < 0) throw new RuntimeException("Stok yetersiz: " + product.getName());
        product.setStock(newStock);
        productRepository.save(product);

        // Sepet elemanını pasifleştir
        ci.setIsActive(false);
        cartItemRepository.save(ci);

        return OrderItem.builder()
            .order(order)
            .product(product)
            .quantity(ci.getQuantity())
            .priceAtPurchase(ci.getPriceWhenAdded())
            .isActive(true)
            .build();
    }).toList();

    // Hepsini kaydet
    orderItemRepository.saveAll(orderItems);

    // 🔧 Order nesnesine elle set et (frontend'e doğru DTO gitmesi için)
    order.setOrderItems(orderItems);

    // Sepeti temizle
    cartService.emptyCart(cart.getId());

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

    @Transactional(readOnly = true)
    public OrderDto getOrderForCurrentUser(Long orderId) {
      String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

      Order order = orderRepository.findWithItemsAndProducts(orderId)
          .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

      if (!order.getUser().getEmail().equals(currentEmail)) {
        throw new AccessDeniedException("This order does not belong to the current user.");
      }

      System.out.println("🔍 OrderItems count: " + order.getOrderItems().size());
      for (OrderItem oi : order.getOrderItems()) {
        System.out.println("🛒 Product: " + (oi.getProduct() != null ? oi.getProduct().getName() : "null"));
      }

      return mapToDto(order);
    }




}
