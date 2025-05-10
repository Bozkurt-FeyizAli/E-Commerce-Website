package com.example.backend.security;

import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
// import io.swagger.v3.oas.models.PathItem.HttpMethod;
import org.springframework.http.HttpMethod;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/swagger-resources/**",
                    "/webjars/**"
                ).permitAll()
    .requestMatchers(
        "/api/auth/**",
        "/api/products",
        "/api/products/**",
        "/api/category",
        "/api/category/**",
        "/api/payments",
        "/api/payments/**",
        "/error"

    ).permitAll()
    .requestMatchers("/api/orders/checkout").authenticated()
    .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
    .requestMatchers(HttpMethod.POST, "/api/reviews").authenticated()
    .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
    .requestMatchers("/api/seller/**").hasAuthority("ROLE_SELLER")
    .requestMatchers("/api/orders/**", "/api/cart/**").authenticated()
    .requestMatchers("/api/payment/**", "/api/cart/**").authenticated()
    .anyRequest().authenticated()
)
.sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
.build();
    }



    @Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));

    configuration.setAllowedMethods(List.of("*")); // Tüm metodlara izin ver
    configuration.setAllowedHeaders(List.of("*")); // Tüm header'lara izin ver
    configuration.setExposedHeaders(List.of(
        "Authorization",
        "Content-Type",
        "Access-Control-Allow-Origin"
    ));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L); // Preflight cache süresi

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }



}
