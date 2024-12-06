package com.example.Task_Management.services;

import com.example.Task_Management.entities.Project;
import com.example.Task_Management.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor

public class ReminderScheduler {

    private final ProjectRepository projectRepository;

    private final EmailService emailService;

    @Scheduled(fixedRate = 3600000) // Check every hour
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime twentyFourHoursLater = now.plusHours(24);

        List<Project> projects = projectRepository.findByDueDateBetween(now, twentyFourHoursLater);

        for (Project project : projects) {
            emailService.sendReminderEmail(project.getUser().getEmail(), project.getTitle());
        }
    }
}
