package com.example.Task_Management.services.employee;

import com.example.Task_Management.dto.ProjectDTO;
import com.example.Task_Management.dto.UserDtoUpdate;
import com.example.Task_Management.entities.User;

import java.util.List;

public interface EmployeeService {
     List<ProjectDTO>getProjectsByUserId();
     User getUserById();
     User UpdateUserById(UserDtoUpdate user);
}
