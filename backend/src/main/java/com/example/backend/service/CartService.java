package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public Cart getCartByUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    public Cart addToCart(String email, Long productId, int quantity) {
        Cart cart = getCartByUser(email);
        Product product = productRepository.findById(productId).orElseThrow();

        // Aynı ürün sepette varsa miktarını güncelle
        CartItem existingItem = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setPriceAtAddition(product.getPrice());

            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return cartRepository.save(cart);
    }

    public void clearCart(String email) {
        Cart cart = getCartByUser(email);
        cartItemRepository.deleteAll(cart.getItems()); // güvenli temizlik
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public List<CartItem> getItems(String email) {
        return getCartByUser(email).getItems();
    }

    public void removeItem(String email, Long productId) {
        Cart cart = getCartByUser(email);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ürün sepette bulunamadı"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cartRepository.save(cart);
    }

    public void updateItemQuantity(String email, Long productId, int newQuantity) {
        Cart cart = getCartByUser(email);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ürün sepette bulunamadı"));

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);
    }

    public void removeFromCart(String username, Long productId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'removeFromCart'");
    }
}
