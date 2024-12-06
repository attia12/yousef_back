package com.example.Task_Management.services.admin;

import com.example.Task_Management.dto.*;
import com.example.Task_Management.entities.Comment;
import com.example.Task_Management.entities.Project;
import com.example.Task_Management.entities.User;
import com.example.Task_Management.enums.ProjectStatus;
import com.example.Task_Management.enums.UserRole;
import com.example.Task_Management.repositories.CommentRepository;
import com.example.Task_Management.repositories.ProjectRepository;
import com.example.Task_Management.repositories.UserRepository;
import com.example.Task_Management.utils.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;

    private final ProjectRepository projectRepository;

    private final JwtUtil jwtUtil;

    private final CommentRepository commentRepository;
    private final ProjectMapper projectMapper;

    @Override
    public List<UserDto> getUsers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getUserRole() == UserRole.EMPLOYEE)
                .map(User::getUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        Optional<User> optionalUser = userRepository.findById(projectDTO.getEmployeeId());
        if (optionalUser.isPresent()){
            Project project = new Project();
            project.setTitle(projectDTO.getTitle());
            project.setDescription(projectDTO.getDescription());
            project.setPriority(projectDTO.getPriority());
            project.setDueDate(projectDTO.getDueDate());
            project.setProjectStatus(ProjectStatus.INPROGRESS);
            project.setUser(optionalUser.get());
            return projectRepository.save(project).getProjectDTO();

        }
        return null;
    }

    @Override
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .filter(project -> project.getDueDate() != null)
                .sorted(Comparator.comparing(Project::getDueDate).reversed())
                .map(Project::getProjectDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    @Override
    public ProjectDTO getProjectById(Long id) {
        Optional<Project> optionalProject = projectRepository.findById(id);
        return optionalProject.map(Project::getProjectDTO).orElse(null);
    }

    @Override
    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        Optional<Project> optionalProject = projectRepository.findById(id);
        Optional<User> optionalUser = userRepository.findById(projectDTO.getEmployeeId());
        if (optionalProject.isPresent() && optionalUser.isPresent()    ){
            Project existingProject = optionalProject.get();
            existingProject.setTitle(projectDTO.getTitle());
            existingProject.setDescription(projectDTO.getDescription());
            existingProject.setDueDate(projectDTO.getDueDate());
            existingProject.setPriority(projectDTO.getPriority());
            existingProject.setProjectStatus(mapStringToProjectStatus(String.valueOf(projectDTO.getProjectStatus())));
            existingProject.setUser(optionalUser.get());
            return projectRepository.save(existingProject).getProjectDTO();
        }
        return null;
    }

    @Override
    public List<ProjectDTO> searchProjectByTitle(String title) {
        return projectRepository.findAllByTitleContaining(title)
                .stream()
                .sorted(Comparator.comparing(Project::getDueDate).reversed())
                .map(Project::getProjectDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CommentDTO createComment(Long projectId, String content) {
        Optional<Project> optionalProject = projectRepository.findById(projectId);
        User user=jwtUtil.getLoggedInUser();
        if((optionalProject.isPresent()) && user !=null){
            Comment comment = new Comment();
            comment.setCreatedAt(new Date());
            comment.setContent(content);
            comment.setProject(optionalProject.get());
            comment.setUser(user);
            return commentRepository.save(comment).getCommentDTO();

        }
        throw new EntityNotFoundException("User or Project not found");
    }

    @Override
    public List<CommentDTO> getCommentsByProjectId(Long projectId) {
        return commentRepository.findAllByProjectId(projectId).stream().map(Comment::getCommentDTO).collect(Collectors.toList());
    }

    @Override
    public Project updateProjectDueDate(ProjectUpdateDTO projectUpdateDTO) {
        Optional<Project> optionalProject = projectRepository.findById(projectUpdateDTO.getId());

        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            project.setDueDate(projectUpdateDTO.getDueDate());
            return projectRepository.save(project);
        }

        throw new RuntimeException("Project not found with id: " + projectUpdateDTO.getId());

    }

    @Override
    public List<ProjectResponse> getProjectsByUserId(Long userId) {
        List<Project> projects = projectRepository.findAllByUserId(userId);
        return projects.stream()
                .map(projectMapper::toProjectResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectDTO validateProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));


        project.setValid(true);
        Project updatedProject = projectRepository.save(project);

        return projectMapper.toProjectDto(updatedProject);
    }

    private ProjectStatus mapStringToProjectStatus(String status){
        return switch (status){
            case "PENDING" -> ProjectStatus.PENDING;
            case "INPROGRESS" -> ProjectStatus.INPROGRESS;
            case "COMPLETED" -> ProjectStatus.COMPLETED;
            case "DEFERRED" -> ProjectStatus.DEFERRED;
            case "TODO" -> ProjectStatus.TODO;
            case "DONE" -> ProjectStatus.DONE;
            default -> ProjectStatus.CANCELLED;
        };
    }
}
