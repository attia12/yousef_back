package com.example.Task_Management.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendReminderEmail(String to, String projectName) {
       try {
           SimpleMailMessage message = new SimpleMailMessage();
           message.setTo(to);
           message.setSubject("Project Due Date Reminder");
           message.setText("Your project '" + projectName + "' is due within 24 hours.");
           mailSender.send(message);
          log.info("Email sent successfully to: {}", to);

       }catch (Exception e)
       {
           log.error("Error sending email to: {}", to, e);

       }
    }
}
