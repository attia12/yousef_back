package com.example.Task_Management.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;


import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter

public class Meeting {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;


    private Long employeeId;


    private String description;


    private Date date;


    private String time;

    private boolean isOnline;

    private String meetLink;
}
