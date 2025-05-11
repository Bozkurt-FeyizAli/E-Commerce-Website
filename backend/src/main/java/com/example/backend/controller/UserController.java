package com.example.backend.controller;

import com.example.backend.dto.OrderDto;
import com.example.backend.dto.PasswordChangeDto;
import com.example.backend.dto.UserDto;
import com.example.backend.service.IUserService;
import com.example.backend.service.IOrderService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;
    private final IOrderService orderService;

    // ✅ Kullanıcının kendi bilgilerini getir
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        UserDto user = userService.getCurrentUser();
        System.out.println();
        System.out.println("Current User: " + user);
        System.out.println();
        return ResponseEntity.ok(user);
    }

    // ✅ Kullanıcının kendi bilgilerini güncelle
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUser(@RequestBody UserDto userDto) {
        Long currentUserId = userService.getCurrentUser().getId(); // Assuming getCurrentUser() returns the current user's details
        UserDto updatedUser = userService.updateUser(currentUserId, userDto);
        return ResponseEntity.ok(updatedUser);
    }

    // ✅ Kullanıcının şifresini güncelle
    @PutMapping("/me/password")
    public ResponseEntity<Void> updatePassword(@RequestBody PasswordChangeDto passwordChangeDto) {
        userService.updatePassword(passwordChangeDto);
        return ResponseEntity.noContent().build();
    }

    // ✅ Kullanıcının profil fotoğrafını yükle (opsiyonel)
    @PostMapping("/me/profile-image")
    public ResponseEntity<String> uploadProfileImage(@RequestParam MultipartFile file) {
        String imageUrl = userService.updateProfileImage(file);
        return ResponseEntity.ok(imageUrl);
    }

    // 🔒 Admin için: Kullanıcıyı güncelle
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(id, userDto);
        return ResponseEntity.ok(updatedUser);
    }

    // 🔒 Admin için: Kullanıcı sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // 🔒 Admin için: Tek kullanıcıyı getir
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // 🔒 Admin için: Aktif tüm kullanıcıları getir
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllActiveUsers() {
        List<UserDto> users = userService.getAllActiveUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/my/order/{id}")
@PreAuthorize("hasRole('USER')")
public ResponseEntity<OrderDto> getMyOrderById(@PathVariable Long id) {
    OrderDto order = orderService.getOrderForCurrentUser(id);
    return ResponseEntity.ok(order);
}

@GetMapping("/orders/{id}")
@PreAuthorize("hasRole('USER')")
public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
    OrderDto order = orderService.getOrderForCurrentUser(id);
    return ResponseEntity.ok(order);
}


}
