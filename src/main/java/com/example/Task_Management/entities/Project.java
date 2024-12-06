package com.example.Task_Management.entities;

import com.example.Task_Management.dto.ProjectDTO;
import com.example.Task_Management.enums.ProjectStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;
import java.util.List;

@Entity
@Data

public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private Date dueDate;

    private String priority;

    private ProjectStatus projectStatus;
    private boolean isValid=false;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;

    public boolean isValid() {
        return isValid;
    }

    public void setValid(boolean valid) {
        isValid = valid;
    }

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;

    public ProjectDTO getProjectDTO() {
        return ProjectDTO.builder()
                .id(id)
                .title(title)
                .description(description)
                .employeeName(user.getName())
                .employeeId(user.getId())
                .projectStatus(projectStatus)
                .dueDate(dueDate)
                .priority(priority)
                .isValid(String.valueOf(isValid))
                .build();
    }


}
