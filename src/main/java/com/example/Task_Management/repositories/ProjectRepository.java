package com.example.Task_Management.repositories;

import com.example.Task_Management.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {


    List<Project> findAllByTitleContaining(String title);

    List<Project> findAllByUserId(Long id);

    List<Project> findByDueDateBetween(LocalDateTime now, LocalDateTime twentyFourHoursLater);
}
