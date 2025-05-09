// package com.example.backend.controller;

// import com.example.backend.dto.ProductRequest;
// import com.example.backend.entity.Category;
// import com.example.backend.entity.Product;
// import com.example.backend.entity.User;
// import com.example.backend.repository.CategoryRepository;
// import com.example.backend.repository.ProductRepository;
// import com.example.backend.repository.UserRepository;
// import com.example.backend.service.JwtService;

// import jakarta.servlet.http.HttpServletRequest;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/seller/products")
// @RequiredArgsConstructor
// public class SellerProductController {

//     private final ProductRepository productRepository;
//     private final CategoryRepository categoryRepository;
//     private final UserRepository userRepository;
//     private final JwtService jwtService;

//     @PostMapping
//     public ResponseEntity<?> addProduct(@RequestBody ProductRequest productRequest, HttpServletRequest request) {
//         // 👇 Token'dan seller id'yi alalım
//         String token = extractToken(request);
//         String username = jwtService.extractUsername(token);
//         User seller = userRepository.findByUsername(username)
//                 .orElseThrow(() -> new RuntimeException("Seller not found"));

//         // 👇 Kategori kontrolü
//         Category category = categoryRepository.findById(productRequest.getCategoryId())
//                 .orElseThrow(() -> new RuntimeException("Category not found"));

//         // 👇 Ürün nesnesi oluştur
//         Product product = Product.builder()
//                 .name(productRequest.getName())
//                 .description(productRequest.getDescription())
//                 .price(productRequest.getPrice())
//                 .stock(productRequest.getStock())
//                 .category(category)
//                 .seller(seller)
//                 .mainImageUrl(productRequest.getImageUrl())
//                 .isActive(true)
//                 .build();

//         productRepository.save(product);

//         return ResponseEntity.ok("Product created successfully.");
//     }

//     private String extractToken(HttpServletRequest request) {
//         String bearer = request.getHeader("Authorization");
//         if (bearer != null && bearer.startsWith("Bearer ")) {
//             return bearer.substring(7);
//         }
//         return null;
//     }
// }
