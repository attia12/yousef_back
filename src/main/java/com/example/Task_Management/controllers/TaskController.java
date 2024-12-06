package com.example.Task_Management.controllers;

import com.example.Task_Management.dto.CountType;
import com.example.Task_Management.dto.TaskResponse;
import com.example.Task_Management.dto.UserDto;
import com.example.Task_Management.entities.Chat;
import com.example.Task_Management.entities.Task;
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
public class TaskController {

    private TaskService taskService;

    @GetMapping("/task")
    public List<Task> getTasks()
    {
        return taskService.getTasks();
    }
    
    @GetMapping("/chat")
    public List<Chat> getChats()
    {
        return taskService.getChats();
    }

    
    @GetMapping("/task/user/{id}")
    public List<TaskResponse> getTasksByUSer(@PathVariable Long id)
    {
        return taskService.getTasksByUserId(id);
    }
    
    @GetMapping("/chat/user/{id}")
    public List<Chat> getChatByUSer(@PathVariable Long id)
    {
        return taskService.getChatByUserId(id);
    }

    @GetMapping("/task/{id}")
    public Task getTask(@PathVariable Long id)
    {
        return taskService.getTaskById(id).
                orElseThrow
                        (
                                ()->new EntityNotFoundException("Requested task not found")
                        );
    }

    @GetMapping("/task/vData/percentCountType")
    List<CountType> getPercentageGroupByType()
    {
        return taskService.getPercentageGroupByType();
    }


    @PostMapping("task/{projectId}")
    public ResponseEntity<Long> addTask(@PathVariable Long projectId, @RequestBody Task task) {
        Task createdTask = taskService.saveTask(task, projectId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask.getId());
    }
    @PostMapping("task")
    public Task addTask( @RequestBody Task task) {
        return taskService.save(task);

    }
    
    @PostMapping("/chat")
    public Chat addChat(@RequestBody Chat chat)
    {
        return taskService.saveChat(chat);

    }

    @PutMapping("task/{id}")
    public ResponseEntity<?> addTask(@RequestBody Task task, @PathVariable Long id)
    {
        if (taskService.existsById(id))
        {
            Task task1 = taskService.getTaskById(id).
                    orElseThrow(
                            ()->new EntityNotFoundException("Requested task not found")
                    );
            task1.setTitle(task.getTitle());
            task1.setDescription(task.getDescription());
            task1.setDueDate(task.getDueDate());
            task1.setType(task.getType());
            taskService.save(task1);
            return ResponseEntity.ok().body(task1);
        }
        else
        {
            HashMap<String, String> message = new HashMap<>();
            message.put("message", id + "task not found or matched");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
        }
    }

    @DeleteMapping("task/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id)
    {
        if (taskService.existsById(id))
        {
            taskService.deleteTask(id);
            HashMap<String, String> message = new HashMap<>();
            message.put("message", "Task with id " + id + "deleted successfully.");
            return ResponseEntity.ok().body(message);
        }
        else {
            HashMap<String, String> message = new HashMap<>();
            message.put("message", id + "task not found or matched");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);

        }
    }
    @GetMapping("test")
    public String hello()
    {
        return "hello";
    }
    @GetMapping("/user/{id}")
    public UserDto getUserById(@PathVariable Long id) {
        return taskService.getUserById(id);

    }
    @GetMapping("/best-user")
    public ResponseEntity<UserDto> getBestUser() {
        try {
            UserDto bestUser = taskService.getBestUserByDoneTasks();
            return ResponseEntity.ok(bestUser);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }
    }

}

