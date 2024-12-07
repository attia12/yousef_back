import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { EmployeeService } from '../../../employee/services/employee.service';

@Component({
  selector: 'app-post-project',
  templateUrl: './post-project.component.html',
  styleUrl: './post-project.component.scss',
})
export class PostProjectComponent {
  projectForm!: FormGroup;
  listOfEmployees: any = [];
  listOfPriorities: any = ['LOW', 'MEDIUM', 'HIGH'];

  constructor(
    private adminService: AdminService,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.getUsers();
    this.projectForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      priority: [null, [Validators.required]],
    });
  }

  getUsers() {
    this.adminService.getUsers().subscribe((res) => {
      this.listOfEmployees = res;
      console.log(res);
    });
  }

  postProject() {
    console.log(this.projectForm.value);
    this.adminService.postProject(this.projectForm.value).subscribe((res) => {
      if (res.id != null) {
        this.snackBar.open('Project posted successfully', 'Close', {
          duration: 5000,
        });
        this.router.navigateByUrl('/admin/dashboard');
      } else {
        this.snackBar.open('Something went wrong', 'ERROR', { duration: 5000 });
      }
    });

    this.adminService
      .AddnotificationByUserId({
        title: this.projectForm.value.title,
        userId: this.projectForm.value.employeeId,
        type: this.projectForm.value.priority, // Assurez-vous que le type est correct
        dueDate: new Date(),
        description: this.projectForm.value.description,
      })
      .subscribe((res) => {
        if (res.id != null) {
          // Récupérez le nombre actuel de notifications pour l'utilisateur
          this.employeeService.getnotificationByUserId(this.projectForm.value.employeeId).subscribe((notificationRes) => {
            const newNotificationCount = notificationRes.length; // Ajustez si nécessaire pour obtenir le nombre exact de notifications
            // Mettre à jour l'interface utilisateur si nécessaire (si vous avez une méthode ou un service pour cela)
            console.log(`New notification count: ${newNotificationCount}`);
          });
        } else {
          this.snackBar.open('Something went wrong', 'ERROR', { duration: 5000 });
        }
      });
  }
}
