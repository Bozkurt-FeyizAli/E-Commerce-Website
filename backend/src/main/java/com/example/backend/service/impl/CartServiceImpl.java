package com.example.backend.service.impl;

import com.example.backend.dto.CartDto;
import com.example.backend.dto.CartItemDto;
import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Cart;
import com.example.backend.entity.CartItem;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ICartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements ICartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public CartDto createCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found7"));

        Cart cart = Cart.builder()
                .user(user)
                .isActive(true)
                .build();

        return mapToDto(cartRepository.save(cart));
    }

    @Override
public CartItemDto addProductToCart(Long cartId, CartItemDto dto) {
    // Eğer Cart yoksa oluştur
    Cart cart = cartRepository.findById(cartId).orElseGet(() -> {
        User user = userRepository.findById(getCurrentUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        Cart newCart = Cart.builder()
            .user(user)
            .isActive(true)
            .createdAt(LocalDateTime.now())
            .build();
        return cartRepository.save(newCart);
    });

    Product product = productRepository.findById(dto.getProductId())
        .orElseThrow(() -> new RuntimeException("Product not found"));

    // Aynı üründen aktif olarak zaten varsa, miktarını artır
    CartItem existingItem = cartItemRepository.findByCartIdAndProductIdAndIsActiveTrue(cart.getId(), product.getId());
    if (existingItem != null) {
        int newQuantity = existingItem.getQuantity() + (dto.getQuantity() != null ? dto.getQuantity() : 1);
        existingItem.setQuantity(newQuantity);
        return mapToItemDto(cartItemRepository.save(existingItem));
    }

    // Yoksa yeni CartItem oluştur
    CartItem cartItem = CartItem.builder()
        .cart(cart)
        .product(product)
        .quantity(dto.getQuantity() != null ? dto.getQuantity() : 1)
        .priceWhenAdded(product.getPrice())
        .isActive(true)
        .build();

    return mapToItemDto(cartItemRepository.save(cartItem));
}

private Long getCurrentUserId() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
        throw new RuntimeException("Not authenticated");
    }

    var username = authentication.getName(); // 🔥 Kullanıcı adı (email veya username)
    var user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    return user.getId();
}




    @Override
    public void removeProductFromCart(Long cartItemId) {
      CartItem cartItem = cartItemRepository.findById(cartItemId)
          .orElseThrow(() -> new RuntimeException("Cart item not found"));

      cartItem.setIsActive(false);
      cartItemRepository.save(cartItem);
    }

    @Override
    public void emptyCart(Long cartId) {
        List<CartItem> cartItems = cartItemRepository.findByCartId(cartId);
        for (CartItem item : cartItems) {
            item.setIsActive(false);
            cartItemRepository.save(item);
        }
    }

    @Override
    public CartDto getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return mapToDto(cart);
    }

    public List<CartItemDto> getCartItems(Long cartId) {
      List<CartItem> items = cartItemRepository.findByCartId(cartId)
        .stream()
        .filter(CartItem::getIsActive)
        .collect(Collectors.toList());

      return items.stream().map(item -> {
        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        dto.setCartId(item.getCart().getId());
        dto.setProductId(item.getProduct().getId());
        dto.setQuantity(item.getQuantity());
        dto.setPriceWhenAdded(item.getPriceWhenAdded());
        dto.setIsActive(item.getIsActive());

        // ✅ Product bilgisi ekle
        Product product = item.getProduct();
        ProductDto productDto = toDto(product);
        dto.setProduct(productDto);

        return dto;
      }).collect(Collectors.toList());
    }



    private CartDto mapToDto(Cart cart) {
        return CartDto.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .isActive(cart.getIsActive())
                .build();
    }

    private CartItemDto mapToItemDto(CartItem item) {
        return CartItemDto.builder()
                .id(item.getId())
                .cartId(item.getCart().getId())
                .productId(item.getProduct().getId())
                .quantity(item.getQuantity())
                .priceWhenAdded(item.getPriceWhenAdded())
                .isActive(item.getIsActive())
                .build();
    }


    public ProductDto toDto(Product product) {
      return ProductDto.builder()
          .id(product.getId())
          .name(product.getName())
          .price(product.getPrice())
          .mainImageUrl(product.getMainImageUrl())
          .description(product.getDescription())
          .build();
  }

    @Override
    public List<CartItemDto> addProductsToCart(Long cartId, List<CartItemDto> cartItemDtos) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItemDto> addedItems = cartItemDtos.stream()
                .map(dto -> {
                    Product product = productRepository.findById(dto.getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found"));

                    CartItem cartItem = CartItem.builder()
                            .cart(cart)
                            .product(product)
                            .quantity(dto.getQuantity() != null ? dto.getQuantity() : 1)
                            .priceWhenAdded(product.getPrice())
                            .isActive(true)
                            .build();

                    return mapToItemDto(cartItemRepository.save(cartItem));
                })
                .collect(Collectors.toList());

        return addedItems;
    }

    @Override
    public CartItemDto updateCartItemQuantity(Long userId, Long itemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCart().getUser().getId().equals(userId)) {
            throw new RuntimeException("You do not have permission to update this cart item");
        }

        cartItem.setQuantity(quantity);
        return mapToItemDto(cartItemRepository.save(cartItem));
    }



}


