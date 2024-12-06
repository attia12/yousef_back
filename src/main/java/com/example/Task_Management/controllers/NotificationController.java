package com.example.Task_Management.controllers;

import com.example.Task_Management.dto.CountType;
import com.example.Task_Management.entities.Notification;
import com.example.Task_Management.entities.Task;
import com.example.Task_Management.services.NotificationService;
import com.example.Task_Management.services.TaskService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping("/api/v1")
public class NotificationController {

    private NotificationService notificationService;

    @GetMapping("/notification")
    public List<Notification> getNotifications()
    {
        return notificationService.getNotifications();
    }

    @GetMapping("/notification/user/{id}")
    public List<Notification> getNotificationsByUSer(@PathVariable Long id)
    {
        return notificationService.getNotificationsByUserId(id);
    }

    @GetMapping("/notification/{id}")
    public Notification getNotificationById(@PathVariable Long id)
    {

        return notificationService.getNotificationsById(id).
                orElseThrow
                        (
                                ()->new EntityNotFoundException("Requested notification not found")
                        );
    }


    @PostMapping("/notification")
    public Notification addTask(@RequestBody Notification notification)
    {
        return notificationService.save(notification);

    }
    @PostMapping("/notification/markAllAsRead/{userId}")
    public void markAllAsRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
    }

    @GetMapping("/notification/unreadCount/{userId}")
    public long getUnreadCount(@PathVariable String userId) {
        return notificationService.countUnreadNotifications(userId);
    }




}

