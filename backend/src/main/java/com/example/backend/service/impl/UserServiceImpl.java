package com.example.backend.service.impl;

import com.example.backend.dto.PasswordChangeDto;
import com.example.backend.dto.RoleDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.RefreshToken;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.IUserService;
import com.example.backend.service.JwtService;
import com.example.backend.service.RefreshTokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;


    @Override
    public void register(UserDto userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new RuntimeException("User is already exists.");
        }
        User user = User.builder()
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .phoneNumber(userDto.getPhoneNumber())
                .addressLine(userDto.getAddressLine())
                .city(userDto.getCity())
                .state(userDto.getState())
                .postalCode(userDto.getPostalCode())
                .country(userDto.getCountry())
                .profileImageUrl(userDto.getProfileImageUrl())
                .isBanned(false)
                .isActive(true)
                .build();

        userRepository.save(user);
    }

    @Override
public Map<String, String> login(String email, String password) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found."));
            
    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Incorrect password.");
    }

    if (!user.getIsActive()) {
        throw new RuntimeException("User is inactive.");
    }

    String role = user.getRoles().stream().findFirst()
            .map(r -> r.getName())
            .orElse("USER");

    String accessToken = jwtService.generateToken(email, role);

    // ✅ Eğer daha önceki refresh token varsa, onu expire et
    refreshTokenService.invalidateUserTokens(email);

    // ✅ Yeni refresh token üret
    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(email);

    return Map.of(
            "accessToken", accessToken,
            "refreshToken", newRefreshToken.getToken()
    );
}


    @Override
    public Map<String, String> refreshToken(String refreshToken) {
        RefreshToken token = refreshTokenService.verifyExpiration(
                refreshTokenService.findByToken(refreshToken)
                        .orElseThrow(() -> new ResourceNotFoundException("Refresh token not found."))
        );

        String newAccessToken = jwtService.generateToken(token.getUser().getEmail(),
          token.getUser().getRoles().stream().findFirst().map(r -> r.getName()).orElse("USER"));

        return Map.of("accessToken", newAccessToken);
    }
@Override
public UserDto updateUser(Long id, UserDto userDto) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String token = ((org.springframework.security.authentication.UsernamePasswordAuthenticationToken) authentication).getCredentials().toString();
    String email = jwtService.extractUsername(token);

    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found3."));

            if (!user.getEmail().equals(email)) {
              throw new RuntimeException("You can only update your own profile.");
          }

    if (userDto.getUsername() != null) user.setUsername(userDto.getUsername());
    if (userDto.getEmail() != null) user.setEmail(userDto.getEmail());
    if (userDto.getFirstName() != null) user.setFirstName(userDto.getFirstName());
    if (userDto.getLastName() != null) user.setLastName(userDto.getLastName());
    if (userDto.getPhoneNumber() != null) user.setPhoneNumber(userDto.getPhoneNumber());
    if (userDto.getAddressLine() != null) user.setAddressLine(userDto.getAddressLine());
    if (userDto.getCity() != null) user.setCity(userDto.getCity());
    if (userDto.getState() != null) user.setState(userDto.getState());
    if (userDto.getPostalCode() != null) user.setPostalCode(userDto.getPostalCode());
    if (userDto.getCountry() != null) user.setCountry(userDto.getCountry());
    if (userDto.getProfileImageUrl() != null) user.setProfileImageUrl(userDto.getProfileImageUrl());

    User updatedUser = userRepository.save(user);

    return mapToDto(updatedUser);
}


@Override
public void deleteUser(Long id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String token = ((UsernamePasswordAuthenticationToken) authentication).getCredentials().toString();
String email = jwtService.extractUsername(token);

    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found2."));

            if (!user.getEmail().equals(email)) {
              throw new RuntimeException("You can only delete your own account.");
          }

    user.setIsActive(false);
    userRepository.save(user);
}


    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found1."));
        return mapToDto(user);
    }

    @Override
    public List<UserDto> getAllActiveUsers() {
        List<User> activeUsers = userRepository.findAll().stream()
                .filter(User::getIsActive)
                .toList();
        return activeUsers.stream()
                .map(this::mapToDto)
                .toList();
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .addressLine(user.getAddressLine())
                .city(user.getCity())
                .state(user.getState())
                .postalCode(user.getPostalCode())
                .country(user.getCountry())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    @Override
public void logout(String refreshToken) {
    RefreshToken token = refreshTokenService.findByToken(refreshToken)
            .orElseThrow(() -> new ResourceNotFoundException("Refresh token not found"));
    refreshTokenService.delete(token);
}

@Override
public UserDto getUserFromToken(String token) {
    String email = jwtService.extractUsername(token); // artık email
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found."));

    List<RoleDto> roleDtos = user.getRoles().stream()
        .map(role -> RoleDto.builder()
            .id(role.getId())
            .name(role.getName())
            .isActive(role.getIsActive())
            .build())
        .toList();

    return UserDto.builder()
        .id(user.getId())
        .username(user.getUsername())
        .email(user.getEmail())
        .roles(roleDtos)
        .build();
}





    @Override
    public UserDto getCurrentUser() {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      String email = jwtService.extractUsername(((org.springframework.security.authentication.UsernamePasswordAuthenticationToken) authentication).getCredentials().toString());

      User user = userRepository.findByEmail(email)
              .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        return mapToDto(user);
    }

    @Override
    public void updatePassword(PasswordChangeDto passwordChangeDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = ((UsernamePasswordAuthenticationToken) authentication).getCredentials().toString();
        String email = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        if (!passwordEncoder.matches(passwordChangeDto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect old password.");
        }

        user.setPassword(passwordEncoder.encode(passwordChangeDto.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public String updateProfileImage(MultipartFile file) {
        // Implement your logic to upload the file and return the URL
        // For example, you can use AWS S3, Google Cloud Storage, etc.
        // Here, we are just returning a dummy URL for demonstration purposes
        String imageUrl = "https://example.com/profile-images/" + file.getOriginalFilename();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User user = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);

        return imageUrl;
    }





}
