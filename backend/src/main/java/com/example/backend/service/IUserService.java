package com.example.backend.service;

import com.example.backend.dto.UserDto;
import java.util.List;
import java.util.Map;

public interface IUserService {
    void register(UserDto userDto);
    Map<String, String> login(String username, String password);
    Map<String, String> refreshToken(String refreshToken);

    UserDto updateUser(Long id, UserDto userDto);
    void deleteUser(Long id);
    UserDto getUserById(Long id);
    List<UserDto> getAllActiveUsers();
}
