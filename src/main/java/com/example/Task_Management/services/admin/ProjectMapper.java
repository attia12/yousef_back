package com.example.Task_Management.services.admin;

import com.example.Task_Management.dto.ProjectDTO;
import com.example.Task_Management.dto.ProjectResponse;
import com.example.Task_Management.dto.TaskResponse;
import com.example.Task_Management.entities.Project;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class ProjectMapper {
    public  ProjectResponse toProjectResponse(Project project) {
        List<TaskResponse> taskResponses = null;


        if (project.getTasks() != null && !project.getTasks().isEmpty()) {
            taskResponses = project.getTasks().stream()
                    .map(task -> new TaskResponse(
                            task.getId(),
                            task.getTitle(),
                            task.getType(),
                            task.getDueDate(),
                            task.getDescription()
                    ))
                    .collect(Collectors.toList());
        }

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .dueDate(project.getDueDate())
                .priority(project.getPriority())
                .projectStatus(String.valueOf(project.getProjectStatus()))
                .tasks(taskResponses)
                .build();
    }

    public ProjectDTO toProjectDto(Project updatedProject) {
        return ProjectDTO.builder().
                id(updatedProject.getId())
                .title(updatedProject.getTitle())
                .description(updatedProject.getDescription())
                .dueDate(updatedProject.getDueDate())
                .priority(updatedProject.getPriority())
                .projectStatus(updatedProject.getProjectStatus())
                .isValid(String.valueOf(updatedProject.isValid()))
                .build();
    }
}
