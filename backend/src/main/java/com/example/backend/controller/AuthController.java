package com.example.backend.controller;

import com.example.backend.dto.UserDto;
import com.example.backend.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Map<String, String>> loginUser(@RequestParam String email, @RequestParam String password) {
        Map<String, String> tokens = userService.login(email, password);
        return ResponseEntity.ok(tokens);
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
public ResponseEntity<UserDto> getCurrentUser(@RequestHeader(value="Authorization" , required=false) String authHeader) {
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
