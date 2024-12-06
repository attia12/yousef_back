package com.example.Task_Management.controllers;

import com.example.Task_Management.dto.AuthenticationRequest;
import com.example.Task_Management.dto.AuthenticationResponse;
import com.example.Task_Management.dto.SignupRequest;
import com.example.Task_Management.dto.UserDto;
import com.example.Task_Management.entities.User;
import com.example.Task_Management.repositories.UserRepository;
import com.example.Task_Management.services.UserService;
import com.example.Task_Management.services.auth.AuthService;
import com.example.Task_Management.utils.JwtUtil;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.json.JsonParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {
    private final AuthService authService;

    private final UserRepository userRepository;

    private final JwtUtil jwtUtil;

    private final UserService userService;

    private final AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody SignupRequest signupRequest) throws IOException {
        if (authService.hasUserWithEmail(signupRequest.getEmail()))
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("User already exist with this email");
        UserDto createdUserDto = authService.signupUser(signupRequest);
        if (createdUserDto == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not created");
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUserDto);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest authenticationRequest){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getEmail(),
                    authenticationRequest.getPassword()));

        } catch ( BadCredentialsException e ){
            throw new BadCredentialsException("Incorrect username or password");
        }
        final UserDetails userDetails = userService.userDetailService().loadUserByUsername(authenticationRequest.getEmail());
        Optional<User> optionalUser = userRepository.findFirstByEmail(authenticationRequest.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        if (optionalUser.isPresent()) {
            authenticationResponse.setJwt(jwtToken);
            authenticationResponse.setUserId(optionalUser.get().getId());
            authenticationResponse.setUserRole(optionalUser.get().getUserRole());
            authenticationResponse.setName(optionalUser.get().getUserDto().getName());
        }
        return authenticationResponse;
    }

    @PostMapping("/logingmail")
    public AuthenticationResponse loginGmail(@RequestBody String email){

        Optional<User> user =  userRepository.findFirstByEmail(email);
        AuthenticationRequest authenticationRequest = new AuthenticationRequest();

        if (user.isPresent()){
            authenticationRequest.setEmail(user.get().getEmail());
            authenticationRequest.setPassword(user.get().getPassword());
        }else {
            throw new BadCredentialsException("Incorrect username or password");
        }


        final UserDetails userDetails = userService.userDetailService().loadUserByUsername(authenticationRequest.getEmail());


        Optional<User> optionalUser = userRepository.findFirstByEmail(authenticationRequest.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();



        if (optionalUser.isPresent()) {
            authenticationResponse.setJwt(jwtToken);
            authenticationResponse.setUserId(optionalUser.get().getId());
            authenticationResponse.setUserRole(optionalUser.get().getUserRole());
            authenticationResponse.setName(optionalUser.get().getUserDto().getName());
        }
        return authenticationResponse;
    }

    @PostMapping("/loginmicrosoft")
    public AuthenticationResponse loginMicrosoft(@RequestBody String email) {
        Optional<User> user =  userRepository.findFirstByEmail(email);
        AuthenticationRequest authenticationRequest = new AuthenticationRequest();

        if (user.isPresent()){
            authenticationRequest.setEmail(user.get().getEmail());
            authenticationRequest.setPassword(user.get().getPassword());
        } else {
            throw new BadCredentialsException("Incorrect username or password");
        }

        final UserDetails userDetails = userService.userDetailService().loadUserByUsername(authenticationRequest.getEmail());

        Optional<User> optionalUser = userRepository.findFirstByEmail(authenticationRequest.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();

        if (optionalUser.isPresent()) {
            authenticationResponse.setJwt(jwtToken);
            authenticationResponse.setUserId(optionalUser.get().getId());
            authenticationResponse.setUserRole(optionalUser.get().getUserRole());
            authenticationResponse.setName(optionalUser.get().getUserDto().getName());
        }
        return authenticationResponse;
    }
    @GetMapping("/failure")
    public ResponseEntity<String> handleFailure(@RequestParam("error") String error) {
        String message = "Authentication failed: " + error;
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
    }
    @GetMapping("/success")
    public ResponseEntity<String> handleSuccess() {
        return ResponseEntity.ok("You are successfully logged in!");
    }
    @PostMapping(value = "/upload/{userId}",consumes = "multipart/form-data")
    public ResponseEntity<?>uploadImage(@PathVariable Long userId,@RequestPart("file") MultipartFile file)
    {
        authService.uploadFile(file,userId);
        return ResponseEntity.accepted().build();


    }


}
