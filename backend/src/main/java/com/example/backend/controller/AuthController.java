package com.example.backend.controller;

import com.example.backend.dto.UserDto;
import com.example.backend.service.IUserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GooglePublicKeysManager;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
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
// Google ile GİRİŞ
@PostMapping("/google-login")
public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
    String idTokenString = request.get("idToken");

    try {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
            new NetHttpTransport(),
            GsonFactory.getDefaultInstance()
        )
        .setAudience(Collections.singletonList("616690897071-bagemhsi4ns0fr6u8gboe7nio5sk6p9h.apps.googleusercontent.com"))
        .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken != null) {
            String email = idToken.getPayload().getEmail();

            if (!userService.userExists(email)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            String name = (String) idToken.getPayload().get("name");
            Map<String, String> tokens = userService.googleLogin(email, name);
            UserDto user = userService.getUserFromToken(tokens.get("accessToken"));

            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", tokens.get("accessToken"));
            response.put("refreshToken", tokens.get("refreshToken"));
            response.put("user", user);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID token");
        }
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google login failed: " + e.getMessage());
    }
}

// Google ile KAYIT
@PostMapping("/google-register")
public ResponseEntity<?> googleRegister(@RequestBody Map<String, String> request) {
    String idTokenString = request.get("idToken");

    try {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
            new NetHttpTransport(),
            GsonFactory.getDefaultInstance()
        )
        .setAudience(Collections.singletonList("616690897071-bagemhsi4ns0fr6u8gboe7nio5sk6p9h.apps.googleusercontent.com"))
        .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken != null) {
            String email = idToken.getPayload().getEmail();
            String name = (String) idToken.getPayload().get("name");

            if (userService.userExists(email)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User already registered");
            }

            Map<String, String> tokens = userService.googleRegister(email, name);
            UserDto user = userService.getUserFromToken(tokens.get("accessToken"));

            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", tokens.get("accessToken"));
            response.put("refreshToken", tokens.get("refreshToken"));
            response.put("user", user);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID token");
        }
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google register failed: " + e.getMessage());
    }
}




// @GetMapping("/profile")
// public ResponseEntity<UserDto> getProfile(@RequestHeader("Authorization") String authHeader) {
//     String token = authHeader.replace("Bearer ", "");
//     UserDto user = userService.getUserFromToken(token);  // Kullanıcının detayları burada dönüyor
//     return ResponseEntity.ok(user);
// }


}
