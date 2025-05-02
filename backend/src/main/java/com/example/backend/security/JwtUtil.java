// package com.example.backend.security;

// import io.jsonwebtoken.*;
// import org.springframework.stereotype.Component;

// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;

// @Component
// public class JwtUtil {

//     private final String secretKey = "secret+key+must+be+at+least+32+characters+long!!!"; // Şimdilik sabit
//     private final long expiration = 86400000; // 1 gün

//     public String generateToken(String username, String role) {
//         Map<String, Object> claims = new HashMap<>();
//         claims.put("role", role);

//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setSubject(username)
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + expiration))
//                 .signWith(SignatureAlgorithm.HS512, secretKey)
//                 .compact();
//     }

//     public String extractUsername(String token) {
//         return getClaims(token).getSubject();
//     }

//     public String extractRole(String token) {
//         return (String) getClaims(token).get("role");
//     }

//     public boolean validateToken(String token) {
//       try {
//           getClaims(token);
//           return true;
//       } catch (ExpiredJwtException e) {
//           throw new RuntimeException("Token has expired.");
//       } catch (JwtException | IllegalArgumentException e) {
//           throw new RuntimeException("Invalid token.");
//       }
//     }



//     private Claims getClaims(String token) {
//         return Jwts.parser()
//                 .setSigningKey(secretKey)
//                 .parseClaimsJws(token)
//                 .getBody();
//     }
// }
