package com.example.Task_Management.repositories;


import com.example.Task_Management.dto.CommentDTO;
import com.example.Task_Management.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByProjectId(Long taskId);
}
