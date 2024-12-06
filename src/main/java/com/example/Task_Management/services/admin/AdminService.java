package com.example.Task_Management.services.admin;

import com.example.Task_Management.dto.*;
import com.example.Task_Management.entities.Project;

import java.util.List;

public interface AdminService {

    List<UserDto> getUsers();

    ProjectDTO createProject(ProjectDTO projectDTO);

    List<ProjectDTO> getAllProjects();

    void deleteProject(Long id);

    ProjectDTO getProjectById(Long id);

    ProjectDTO updateProject(Long id, ProjectDTO projectDTO);

    List<ProjectDTO> searchProjectByTitle(String title);

    CommentDTO createComment(Long projectId, String content);

    List<CommentDTO> getCommentsByProjectId(Long projectId);

    Project updateProjectDueDate(ProjectUpdateDTO projectUpdateDTO);

    List<ProjectResponse> getProjectsByUserId(Long userId);

    ProjectDTO validateProject(Long id);
}
