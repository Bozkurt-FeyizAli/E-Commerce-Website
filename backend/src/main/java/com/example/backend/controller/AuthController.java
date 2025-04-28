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
    public ResponseEntity<Map<String, String>> loginUser(@RequestParam String username, @RequestParam String password) {
        Map<String, String> tokens = userService.login(username, password);
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshAccessToken(@RequestParam String refreshToken) {
        Map<String, String> newAccessToken = userService.refreshToken(refreshToken);
        return ResponseEntity.ok(newAccessToken);
    }
}
