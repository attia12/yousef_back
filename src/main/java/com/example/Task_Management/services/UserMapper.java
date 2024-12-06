package com.example.Task_Management.services;

import com.example.Task_Management.FileUtils;
import com.example.Task_Management.dto.UserDto;
import com.example.Task_Management.entities.User;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {
    public UserDto toUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .userRole(user.getUserRole())
                .image(FileUtils.readFileFromLocation(user.getImage()))

                .build();
    }
}
