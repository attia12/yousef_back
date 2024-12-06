package com.example.Task_Management.controllers;

import com.example.Task_Management.entities.Meeting;
import com.example.Task_Management.services.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {
    @Autowired
    private MeetingService meetingService;

    // Create a new meeting
    @PostMapping
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
        Meeting createdMeeting = meetingService.createMeeting(meeting);
        return new ResponseEntity<>(createdMeeting, HttpStatus.CREATED);
    }

    // Get all meetings
    @GetMapping
    public ResponseEntity<List<Meeting>> getAllMeetings() {
        List<Meeting> meetings = meetingService.getAllMeetings();
        return new ResponseEntity<>(meetings, HttpStatus.OK);
    }

    // Get a specific meeting by ID
    @GetMapping("/{id}")
    public ResponseEntity<Meeting> getMeetingById(@PathVariable Long id) {
        Optional<Meeting> meeting = meetingService.getMeetingById(id);
        return meeting.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }




    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeeting(@PathVariable Long id) {
        boolean isDeleted = meetingService.deleteMeeting(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Meeting>> getMeetingsByEmployeeId(@PathVariable Long employeeId) {
        List<Meeting> meetings = meetingService.getMeetingsByEmployeeId(employeeId);
        if (meetings.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return new ResponseEntity<>(meetings, HttpStatus.OK);
    }
}
