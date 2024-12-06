package com.example.Task_Management.dto;

import com.example.Task_Management.enums.UserRole;
import lombok.Data;

@Data
public class AuthenticationResponse {

    private String jwt;

    private Long userId;
	private String name;

    private UserRole userRole;
    
    public String getJwt() {
		return jwt;
	}

	public void setJwt(String jwt) {
		this.jwt = jwt;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UserRole getUserRole() {
		return userRole;
	}

	public void setUserRole(UserRole userRole) {
		this.userRole = userRole;
	}



}
