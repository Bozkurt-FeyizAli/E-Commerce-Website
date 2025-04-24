package com.example.backend.controller;

import com.example.backend.entity.Cart;
import com.example.backend.entity.CartItem;
import com.example.backend.service.CartService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carts")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItem> getCartItems(@AuthenticationPrincipal UserDetails userDetails) {
        return cartService.getItems(userDetails.getUsername());
    }

    @PostMapping("/add")
public Cart addItem(@AuthenticationPrincipal UserDetails userDetails,
                    @RequestBody AddToCartRequest request) {
    return cartService.addToCart(userDetails.getUsername(), request.productId, request.quantity);
}

@DeleteMapping("/remove")
public void removeItem(@AuthenticationPrincipal UserDetails userDetails,
                       @RequestParam Long productId) {
    cartService.removeFromCart(userDetails.getUsername(), productId);
}


    @DeleteMapping("/clear")
    public void clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
    }

    public static class AddToCartRequest {
      public Long productId;
      public int quantity = 1;
  }

}
