package com.example.Task_Management;

import com.example.Task_Management.entities.User;
import com.example.Task_Management.enums.UserRole;
import com.example.Task_Management.repositories.UserRepository;
import com.example.Task_Management.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
@Component

public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;


@Override
public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                    Authentication authentication) throws IOException {
    OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
    String email = oauthUser.getAttribute("email");
    String name = oauthUser.getAttribute("name");


    User existingUser = userRepository.findByEmail(email);
    User savedUser;

    if (existingUser != null) {

        savedUser = existingUser;
    } else {

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setUserRole(UserRole.EMPLOYEE);
        savedUser = userRepository.save(user);
    }


    String token = jwtUtil.generateToken(savedUser);
    System.out.println("token ---------------" + token);


    response.setHeader("Authorization", "Bearer " + token);


    response.sendRedirect("http://localhost:4200/employee/dashboard?token=" + token);
}
}
