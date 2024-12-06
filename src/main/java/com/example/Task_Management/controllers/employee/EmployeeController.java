package com.example.Task_Management.controllers.employee;

import com.example.Task_Management.dto.ProjectDTO;
import com.example.Task_Management.dto.ProjectResponse;
import com.example.Task_Management.dto.UserDtoUpdate;
import com.example.Task_Management.entities.Project;
import com.example.Task_Management.entities.Task;
import com.example.Task_Management.entities.User;
import com.example.Task_Management.repositories.ProjectRepository;
import com.example.Task_Management.services.PdfGenerationService;
import com.example.Task_Management.services.admin.AdminService;
import com.example.Task_Management.services.employee.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final AdminService adminService;
    private final PdfGenerationService pdfGenerationService;
    private final ProjectRepository projectRepository;

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDTO>> getProjectsByUserId() {
       return ResponseEntity.ok(employeeService.getProjectsByUserId());
    }

    @GetMapping("/id")
    public ResponseEntity<User> getUserById() {
        return ResponseEntity.ok(employeeService.getUserById());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> UpdateUserById(@RequestBody UserDtoUpdate user) {
        return ResponseEntity.ok(employeeService.UpdateUserById(user));
    }
    @GetMapping("/projects/user/{userId}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByUserId(@PathVariable Long userId) {
        List<ProjectResponse> projects = adminService.getProjectsByUserId(userId);

        if (projects.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(projects);
    }
    @GetMapping("/projects/{projectId}/pdf")
    public ResponseEntity<InputStreamResource> downloadPdf(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ByteArrayInputStream bis = pdfGenerationService.generateProjectPdf(project);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=project_report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }


}
