package com.example.backend.controller;

import com.example.backend.dto.PasswordChangeDto;
import com.example.backend.dto.UserDto;
import com.example.backend.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    // ✅ Kullanıcının kendi bilgilerini getir
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        UserDto user = userService.getCurrentUser();
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
}
