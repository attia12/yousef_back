package com.example.Task_Management.services.auth;

import com.example.Task_Management.dto.SignupRequest;
import com.example.Task_Management.dto.UserDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AuthService {

    UserDto signupUser(SignupRequest signupRequest) throws IOException;

    boolean hasUserWithEmail(String email);

    void uploadFile(MultipartFile file, Long userId);
}
