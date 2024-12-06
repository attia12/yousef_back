package com.example.Task_Management.repositories;

import com.example.Task_Management.entities.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findByEmployeeId(Long employeeId);
}
