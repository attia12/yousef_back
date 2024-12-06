package com.example.Task_Management.services;

import com.example.Task_Management.dto.CountType;
import com.example.Task_Management.entities.Notification;
import com.example.Task_Management.repositories.NotificationRepository;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class NotificationService {

    private NotificationRepository notificationRepository;

    public List<Notification> getNotifications()
    {
        return notificationRepository.getAllNotification();
    }

    public List<Notification> getNotificationsByUserId(Long user_id)
    {
        return notificationRepository.getAllNotificationByUserId(user_id);
    }

    public Optional<Notification> getNotificationsById(Long id)
    {
        return notificationRepository.findById(id);
    }

    public Notification save(Notification task)
    {
        return notificationRepository.saveAndFlush(task);
    }

    public boolean existsById(Long id)
    {
        return notificationRepository.existsById(id);
    }


    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        for (Notification notification : notifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(notifications);
    }

    public long countUnreadNotifications(String userId) {
        return notificationRepository.findByUserId(userId).stream()
                .filter(notification -> !notification.isRead())
                .count();
    }
    @Transactional
    @Scheduled(fixedRate = 3600000)
    public void deleteOldReadNotifications() {
        Date cutoffDate = new Date(System.currentTimeMillis() - (48 * 60 * 60 * 1000)); // 48 hours ago
        notificationRepository.deleteByIsReadTrueAndDueDateBefore(cutoffDate);
    }
}
