package com.example.Task_Management.dto;

import lombok.Data;

@Data
public class SignupRequest {

    private String name;

    private String email;

    private String password;
}
