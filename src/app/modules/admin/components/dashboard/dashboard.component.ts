import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  listOfProjects: any = [];
  searchForm!:FormGroup


  constructor(private service: AdminService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder
  ){
    this.getProjects();
    this.searchForm = this.fb.group({
      title: [null]
    })

  }

  getProjects(){
    this.service.getAllProjects().subscribe((res) => {
      this.listOfProjects = res;
      console.log(res)
    })
  }

  deleteProject(id:number){
    this.service.deleteProject(id).subscribe((res)=>{
       this.snackbar.open("Project deleted successfully","Close",{duration:5000});
       this.getProjects();
    })

  }

  searchProject(){
    this.listOfProjects = [];
    const title = this.searchForm.get('title')!.value;
    console.log(title);
    this.service.searchProject(title).subscribe((res)=>{
      console.log(res);
      this.listOfProjects = res;
    })
  }

  validerProject(projectId: string): void {
    // Show confirmation before validating the project
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to validate this project.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, validate it!',
      cancelButtonText: 'No, keep it as is!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.validateProjectInBackend(projectId);

        Swal.fire(
          'Validated!',
          'The project has been successfully validated.',
          'success'
        );
      } else {
        Swal.fire(
          'Cancelled',
          'The project was not validated.',
          'info'
        );
      }
    });
  }

  validateProjectInBackend(projectId: any): void {
    this.service.validateProject(projectId).subscribe(
      (res) => {
        // Find and update the project status locally in the list without reloading
        this.listOfProjects = this.listOfProjects.map((project:any) => {
          if (project.id === projectId) {
            project.isValid = 'true';
          }
          return project;
        });

      },
      (error) => {
        console.error('Error validating project:', error);
        alert('Error validating project!');
      }
    );
  }
}
