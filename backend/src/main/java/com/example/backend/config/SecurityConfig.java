// package com.example.backend.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// import com.example.backend.service.impl.UserDetailsServiceImpl;

// @Configuration
// public class SecurityConfig {

//     private final JwtAuthFilter jwtAuthFilter;
//     private final UserDetailsServiceImpl userDetailsService;

//     public SecurityConfig(JwtAuthFilter jwtAuthFilter, UserDetailsServiceImpl userDetailsService) {
//         this.jwtAuthFilter = jwtAuthFilter;
//         this.userDetailsService = userDetailsService;
//     }

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         return http
//         .csrf(csrf -> csrf.disable())
//         .formLogin(form -> form.disable()) // ← önemli
//         .httpBasic(httpBasic -> httpBasic.disable()) // ← önemli
//                 .authorizeHttpRequests(auth -> auth
//                         .requestMatchers("/auth/**").permitAll()
//                         .requestMatchers("/products/**", "/category/**").permitAll()
//                         .requestMatchers("/admin/**").hasRole("ADMIN") // 🔒 sadece admin
//                         .anyRequest().authenticated()
//                 )
//                 .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                 .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
//                 .build();
//     }

//     @Bean
//     public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//         return config.getAuthenticationManager();
//     }
// }
