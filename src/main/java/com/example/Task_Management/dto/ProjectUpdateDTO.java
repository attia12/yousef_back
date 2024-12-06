package com.example.Task_Management.dto;

import lombok.Data;

import java.util.Date;
@Data

public class ProjectUpdateDTO {
    private Long id;
    private Date dueDate;
}
