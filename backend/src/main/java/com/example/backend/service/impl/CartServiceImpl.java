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
import org.springframework.stereotype.Service;

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
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

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
    List<CartItem> items = cartItemRepository.findByCartId(cartId);
    return items.stream().map(item -> {
        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        dto.setCartId(item.getCart().getId());
        dto.setProductId(item.getProduct().getId());
        dto.setQuantity(item.getQuantity());
        dto.setPriceWhenAdded(item.getPriceWhenAdded());
        dto.setIsActive(item.getIsActive());

        // ✅ Product bilgisi ekle
        Product product = item.getProduct(); // Eager fetch ise direkt var, yoksa productService.getById() ile alırsın
        ProductDto productDto = toDto(product); // varsa ProductMapper
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



}


