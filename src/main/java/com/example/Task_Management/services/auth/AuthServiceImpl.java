package com.example.Task_Management.services.auth;

import com.example.Task_Management.FileStorageService;
import com.example.Task_Management.dto.SignupRequest;
import com.example.Task_Management.dto.UserDto;
import com.example.Task_Management.entities.User;
import com.example.Task_Management.enums.UserRole;
import com.example.Task_Management.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @PostConstruct
    public void createAnAdminAccount(){
        Optional<User> optionalUser = userRepository.findByUserRole(UserRole.ADMIN);
        if(optionalUser.isEmpty()){
            User user = new User();
            user.setEmail("admin@test.com");
            user.setName("admin");
            user.setPassword(new BCryptPasswordEncoder().encode("admin"));
            user.setUserRole(UserRole.ADMIN);
            userRepository.save(user);
            System.out.println("Admin account created successfully!");

        } else {
            System.out.println("Admin account already exist!");
        }

    }

    @Override
    public UserDto signupUser(SignupRequest signupRequest) throws IOException {
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setName(signupRequest.getName());
        user.setPassword(new BCryptPasswordEncoder().encode(signupRequest.getPassword()));
        user.setUserRole(UserRole.EMPLOYEE);
        User createdUser = userRepository.save(user);
        return createdUser.getUserDto();
    }

    @Override
    public boolean hasUserWithEmail(String email) {
        return userRepository.findFirstByEmail(email).isPresent();
    }

    @Override
    public void uploadFile(MultipartFile file, Long userId) {
        User user=userRepository.findById(userId).orElseThrow(()-> new EntityNotFoundException("No User found with the id ::"+userId));
        var userImage=fileStorageService.saveFile(file,userId);
        user.setImage(userImage);
        userRepository.save(user);
    }
}
