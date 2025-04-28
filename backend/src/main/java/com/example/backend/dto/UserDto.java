package com.example.backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;

    @NotBlank(message = "Username is required.")
    private String username;

    @NotBlank(message = "Email is required.")
    @Email(message = "Email format is invalid.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 6, message = "Password must be at least 6 characters.")
    private String password;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String addressLine;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String profileImageUrl;
    private Boolean isBanned;
    private Boolean isActive;
}
