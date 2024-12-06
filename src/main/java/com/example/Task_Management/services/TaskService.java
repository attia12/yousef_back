package com.example.Task_Management.services;

import com.example.Task_Management.dto.CountType;
import com.example.Task_Management.dto.TaskResponse;
import com.example.Task_Management.dto.UserDto;
import com.example.Task_Management.entities.Chat;
import com.example.Task_Management.entities.Project;
import com.example.Task_Management.entities.Task;
import com.example.Task_Management.entities.User;
import com.example.Task_Management.repositories.ChatRepository;
import com.example.Task_Management.repositories.ProjectRepository;
import com.example.Task_Management.repositories.TaskRepository;
import com.example.Task_Management.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TaskService {

    private TaskRepository taskRepository;
    private ChatRepository chatRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<Task> getTasks()
    {
        return taskRepository.getAllTaskByDueDate();
    }
    
    public List<Chat> getChats()
    {
        return chatRepository.getAllChat();
    }
    
    public List<TaskResponse> getTasksByUserId(Long user_id)
    {List<Task> tasks = taskRepository.getAllTaskByUserId(user_id);


        return tasks.stream()
                .map(task -> new TaskResponse(
                        task.getId(),
                        task.getTitle(),
                        task.getType(),
                        task.getDueDate(),
                        task.getDescription()
                ))
                .collect(Collectors.toList());
    }
    
    public List<Chat> getChatByUserId(Long user_id)
    {
    		System.out.println("eeeeeeeeeeeeee"+user_id);
        return chatRepository.getAllChatByUserId(user_id);
    }

    public Optional<Task> getTaskById(Long id)
    {
        return taskRepository.findById(id);
    }

    public Task save(Task task)
    {
        return taskRepository.saveAndFlush(task);
    }
    
    public Chat saveChat(Chat chat)
    {
        return chatRepository.saveAndFlush(chat);
    }

    public boolean existsById(Long id)
    {
        return taskRepository.existsById(id);
    }

    public void deleteTask(Long id)
    {
        taskRepository.deleteById(id);
    }

    public List<CountType> getPercentageGroupByType()
    {
        return taskRepository.getPercentageGroupByType();

    }

    public Task saveTask(Task task, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id " + projectId));


        task.setProject(project);


        return taskRepository.save(task);
    }

    public UserDto getUserById(Long id) {
        return userRepository.findById(id).map(userMapper::toUserDto)
                .orElseThrow(()->new EntityNotFoundException("No User Found by this id :: "+id));
    }

    public UserDto getBestUserByDoneTasks() throws IOException {
        List<Object[]> result = taskRepository.findTopUserByDoneTasks();
        if (!result.isEmpty()) {
            String topUserId = (String) result.get(0)[0];


            User user = userRepository.findById(Long.valueOf(topUserId))
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserDto userDto = user.getUserDto();

            return userDto;
        }
        throw new RuntimeException("No tasks marked as 'done' found");
    }
}
