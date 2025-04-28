package com.example.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
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
