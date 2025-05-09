package com.example.backend.service;

import com.example.backend.dto.PasswordChangeDto;
import com.example.backend.dto.ProductDto;
import com.example.backend.dto.UserDto;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface IUserService {
    void register(UserDto userDto);
    Map<String, String> login(String useremail, String password);
    Map<String, String> refreshToken(String refreshToken);

    UserDto updateUser(Long id, UserDto userDto);
    void deleteUser(Long id);
    UserDto getUserById(Long id);
    List<UserDto> getAllActiveUsers();
    void logout(String refreshToken);
    UserDto getUserFromToken(String token);
    UserDto getCurrentUser();
    void updatePassword(PasswordChangeDto passwordChangeDto);
    String updateProfileImage(MultipartFile file);

}
