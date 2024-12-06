package com.example.Task_Management.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Notification {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "Id")
	private Long id;
	private String title;
	@Column(name = "user_id")
	private String userId;
	private String type;
	private Date dueDate;
	private String description;
	private boolean isRead=false;






}
