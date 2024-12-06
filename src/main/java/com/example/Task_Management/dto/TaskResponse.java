package com.example.Task_Management.dto;

import lombok.*;

import java.util.Date;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder


public class TaskResponse {
    private Long id;
    private String title;

    private String type;
    private Date dueDate;
    private String description;
}
