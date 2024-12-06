package com.example.Task_Management.dto;

import lombok.*;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private Date dueDate;
    private String priority;

    private String projectStatus;


    private List<TaskResponse> tasks;
}
