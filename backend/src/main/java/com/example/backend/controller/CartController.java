package com.example.backend.controller;

import com.example.backend.dto.CartDto;
import com.example.backend.dto.CartItemDto;
import com.example.backend.service.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final ICartService cartService;

    @PostMapping("/{userId}")
    public ResponseEntity<CartDto> createCart(@PathVariable Long userId) {
        CartDto createdCart = cartService.createCart(userId);
        return ResponseEntity.ok(createdCart);
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartItemDto> addProductToCart(@PathVariable Long cartId, @RequestBody CartItemDto cartItemDto) {
        CartItemDto addedItem = cartService.addProductToCart(cartId, cartItemDto);
        return ResponseEntity.ok(addedItem);
    }
    @PostMapping("/{cartId}/items/bulk")
    public ResponseEntity<List<CartItemDto>> addProductsToCart(
      @PathVariable Long cartId,
      @RequestBody List<CartItemDto> cartItemDtos) {
        List<CartItemDto> addedItems = cartService.addProductsToCart(cartId, cartItemDtos);
        return ResponseEntity.ok(addedItems);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeProductFromCart(@PathVariable Long cartItemId) {
        cartService.removeProductFromCart(cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{cartId}/empty")
    public ResponseEntity<Void> emptyCart(@PathVariable Long cartId) {
        cartService.emptyCart(cartId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CartDto> getCartByUserId(@PathVariable Long userId) {
        CartDto cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/{cartId}/items")
    public ResponseEntity<List<CartItemDto>> getCartItems(@PathVariable Long cartId) {
        List<CartItemDto> items = cartService.getCartItems(cartId);
        return ResponseEntity.ok(items);
    }

    @PatchMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartItemDto> updateCartItemQuantity(
        @PathVariable Long userId,
        @PathVariable Long itemId,
        @RequestBody CartItemDto cartItemDto) {

    CartItemDto updatedItem = cartService.updateCartItemQuantity(userId, itemId, cartItemDto.getQuantity());
    return ResponseEntity.ok(updatedItem);
}

@PostMapping("/user/{userId}/items")
public ResponseEntity<CartItemDto> addItemForUser(
        @PathVariable Long userId,
        @RequestBody CartItemDto cartItemDto) {

    CartItemDto addedItem = cartService.addProductToCartByUserId(userId, cartItemDto);
    return ResponseEntity.ok(addedItem);
}


}
