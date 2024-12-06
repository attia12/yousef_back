package com.example.Task_Management.repositories;

import com.example.Task_Management.dto.CountType;
import com.example.Task_Management.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>
{
    @Query(value = "select * from notification order by due_date desc ", nativeQuery = true)
    public List<Notification> getAllNotification();
    
    @Query(value = "select * from notification where user_id = :user_id order by due_date desc ", nativeQuery = true)
    public List<Notification> getAllNotificationByUserId(@Param("user_id") Long userId);

    @Query(value = "select new com.example.Task_Management.dto.CountType(COUNT(*)/(Select COUNT(*) from Notification) *100, type ) from Notification GROUP BY type")
    public List<CountType> getPercentageGroupByType();

    List<Notification> findByUserId(String userId);

    void deleteByIsReadTrueAndDueDateBefore(Date cutoffDate);
}
