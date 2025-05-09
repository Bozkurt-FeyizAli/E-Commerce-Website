package com.example.backend.controller;

import com.example.backend.dto.UserDto;
import com.example.backend.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {


    private final IUserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody @Valid UserDto userDto) {
        userService.register(userDto);
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
public ResponseEntity<Map<String, Object>> loginUser(@RequestParam String email, @RequestParam String password) {
    Map<String, String> tokens = userService.login(email, password);
    UserDto user = userService.getUserFromToken(tokens.get("accessToken"));

    Map<String, Object> response = new HashMap<>();
    response.put("accessToken", tokens.get("accessToken"));
    response.put("refreshToken", tokens.get("refreshToken"));
    response.put("user", user); // 👈 Kullanıcı bilgilerini ekle

    return ResponseEntity.ok(response);
}


    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshAccessToken(@RequestParam String refreshToken) {
        Map<String, String> newAccessToken = userService.refreshToken(refreshToken);
        return ResponseEntity.ok(newAccessToken);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(@RequestParam String refreshToken) {
        userService.logout(refreshToken);
        return ResponseEntity.ok("Logged out successfully.");
    }

    @GetMapping("/me")
public ResponseEntity<UserDto> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String token = authHeader.replace("Bearer ", "");
    UserDto user = userService.getUserFromToken(token);
    return ResponseEntity.ok(user);
}


// @GetMapping("/profile")
// public ResponseEntity<UserDto> getProfile(@RequestHeader("Authorization") String authHeader) {
//     String token = authHeader.replace("Bearer ", "");
//     UserDto user = userService.getUserFromToken(token);  // Kullanıcının detayları burada dönüyor
//     return ResponseEntity.ok(user);
// }


}
