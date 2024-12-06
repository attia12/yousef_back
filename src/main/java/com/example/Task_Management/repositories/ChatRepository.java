package com.example.Task_Management.repositories;

import com.example.Task_Management.dto.CountType;
import com.example.Task_Management.entities.Chat;
import com.example.Task_Management.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long>
{

    @Query(value = "select * from chat where user_id = :user_id", nativeQuery = true)
    public List<Chat> getAllChatByUserId(@Param("user_id") Long userId);
    
    @Query(value = "select * from chat", nativeQuery = true)
    public List<Chat> getAllChat();

    
}
