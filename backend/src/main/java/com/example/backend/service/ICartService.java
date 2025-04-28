package com.example.backend.service;

import com.example.backend.dto.CartDto;
import com.example.backend.dto.CartItemDto;

import java.util.List;

public interface ICartService {

    CartDto createCart(Long userId);

    CartItemDto addProductToCart(Long cartId, CartItemDto cartItemDto);

    void removeProductFromCart(Long cartItemId);

    void emptyCart(Long cartId);

    CartDto getCartByUserId(Long userId);

    List<CartItemDto> getCartItems(Long cartId);
}
