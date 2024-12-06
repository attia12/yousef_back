package com.example.Task_Management.dto;


import lombok.Data;

import java.util.Date;

@Data
public class CommentDTO {

    private Long id;

    private String content;

    private Date createdAt;

    private Long projectId;

    private Long userId;

    private String postedBy;

}
