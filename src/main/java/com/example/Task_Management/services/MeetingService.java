package com.example.Task_Management.services;

import com.example.Task_Management.entities.Meeting;
import com.example.Task_Management.entities.Notification;
import com.example.Task_Management.repositories.MeetingRepository;
import com.example.Task_Management.repositories.NotificationRepository;
import com.pusher.rest.Pusher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MeetingService {
    @Autowired
    private MeetingRepository meetingRepository;
    @Autowired
    private Pusher pusher;
    @Autowired
    private NotificationRepository notificationRepository;


    public Meeting createMeeting(Meeting meeting) {
        Meeting savedMeeting = meetingRepository.save(meeting);
        Notification notification=Notification.builder()
                .userId(meeting.getEmployeeId().toString())
                .title("Meeting")
                .description(meeting.getDescription())
                .dueDate(meeting.getDate())
                .type("meeting")


                .build();
        notificationRepository.save(notification);


        pusher.trigger("meeting-channel", "meeting-created", savedMeeting);

        return savedMeeting;
    }


    public List<Meeting> getAllMeetings() {
        return meetingRepository.findAll();
    }


    public Optional<Meeting> getMeetingById(Long id) {
        return meetingRepository.findById(id);
    }





    public boolean deleteMeeting(Long id) {
        if (meetingRepository.existsById(id)) {
            meetingRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Meeting> getMeetingsByEmployeeId(Long employeeId) {
        return meetingRepository.findByEmployeeId(employeeId);
    }
}
