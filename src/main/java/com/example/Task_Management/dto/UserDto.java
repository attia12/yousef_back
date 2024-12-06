package com.example.Task_Management.dto;

import com.example.Task_Management.enums.UserRole;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserDto {

    private Long id;

    private String name;

    private String email;

    private String password;

    private UserRole userRole;
	private byte[] image;





}
