package com.example.Task_Management.services.employee;

import com.example.Task_Management.dto.ProjectDTO;
import com.example.Task_Management.dto.UserDtoUpdate;
import com.example.Task_Management.entities.Project;
import com.example.Task_Management.entities.Task;
import com.example.Task_Management.entities.User;
import com.example.Task_Management.repositories.ProjectRepository;
import com.example.Task_Management.repositories.UserRepository;
import com.example.Task_Management.utils.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService{
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;


    private final JwtUtil jwtUtil;

    @Override
    public List<ProjectDTO> getProjectsByUserId() {
        User user =jwtUtil.getLoggedInUser();
        if (user != null){
            return projectRepository.findAllByUserId(user.getId())
                    .stream()
                    .sorted(Comparator.comparing(Project::getDueDate).reversed())
                    .map(Project::getProjectDTO)
                    .toList();


        }
        throw new EntityNotFoundException("User not found");
    }



    public User getUserById() {
        User user =jwtUtil.getLoggedInUser();
        if (user != null){
            return user;
        }
        throw new EntityNotFoundException("User not found");
    }

    public User UpdateUserById(UserDtoUpdate autoupdate) {
        User user =jwtUtil.getLoggedInUser();
        if (user != null){

            user.setName(autoupdate.getName());
            user.setEmail(autoupdate.getEmail());

            userRepository.save(user);

            return user;

        }
        throw new EntityNotFoundException("User not found");
    }
}
