package com.example.Task_Management;



import com.example.Task_Management.dto.ProjectDTO;
import com.example.Task_Management.entities.Project;
import com.example.Task_Management.entities.User;
import com.example.Task_Management.enums.ProjectStatus;
import com.example.Task_Management.repositories.ProjectRepository;

import com.example.Task_Management.repositories.UserRepository;
import com.example.Task_Management.services.admin.AdminServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;


public class ProjectServiceTest {
    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;  // Mock du UserRepository

    @InjectMocks
    private AdminServiceImpl projectService;

    private User mockUser;
    private Project mockProject;
    private ProjectDTO projectDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Création d'un utilisateur fictif
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("John Doe");

        // Création d'un projet fictif
        mockProject = new Project();
        mockProject.setId(1L);
        mockProject.setTitle("Test Project");
        mockProject.setDescription("Test Description");
        mockProject.setDueDate(new java.util.Date());
        mockProject.setPriority("High");
        mockProject.setProjectStatus(ProjectStatus.INPROGRESS);
        mockProject.setUser(mockUser);

        // Utilisation de Builder pour créer un DTO
        projectDTO = ProjectDTO.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .dueDate(new java.util.Date())
                .priority("High")
                .projectStatus(ProjectStatus.INPROGRESS)
                .employeeId(1L)
                .employeeName("John Doe")
                .isValid("false") // ou "true" selon votre besoin
                .build();

        // Mocking de la méthode findById de userRepository pour renvoyer un utilisateur fictif
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
    }

    @Test
    void createProjectTest() {
        // Mocking la méthode save de projectRepository pour renvoyer un projet fictif
        when(projectRepository.save(any(Project.class))).thenReturn(mockProject);

        // Test que la création de projet renvoie bien un ProjectDTO
        ProjectDTO createdProjectDTO = projectService.createProject(projectDTO);

        assertNotNull(createdProjectDTO);
        assertEquals(mockProject.getTitle(), createdProjectDTO.getTitle());
        assertEquals(mockProject.getDescription(), createdProjectDTO.getDescription());
        assertEquals(mockProject.getPriority(), createdProjectDTO.getPriority());
        assertEquals(mockProject.getProjectStatus(), createdProjectDTO.getProjectStatus());
        assertEquals(mockProject.getUser().getName(), createdProjectDTO.getEmployeeName());
    }
    @Test
    void getProjectByIdTest() {
        // Mocking the repository findById method
        when(projectRepository.findById(1L)).thenReturn(Optional.of(mockProject));

        // Test that projectService.getProjectById returns the correct ProjectDTO
        ProjectDTO foundProjectDTO = projectService.getProjectById(1L);

        assertNotNull(foundProjectDTO);
        assertEquals(mockProject.getTitle(), foundProjectDTO.getTitle());
        assertEquals(mockProject.getDescription(), foundProjectDTO.getDescription());
    }

    @Test
    void deleteProjectTest() {
        // Mocking the repository deleteById method
        doNothing().when(projectRepository).deleteById(1L);

        // Test that projectService.deleteProject deletes the project
        projectService.deleteProject(1L);

        // Verify that the delete method was called with the correct project ID
        verify(projectRepository, times(1)).deleteById(1L);
    }
}
