import { Component } from '@angular/core';
import { AdminModule } from '../../admin.module';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrl: './update-project.component.scss'
})
export class UpdateProjectComponent {

  id:number = this.route.snapshot.params["id"];
  updateProjectForm!: FormGroup;
  listOfEmployees: any = [];
  listOfPriorities: any = ["LOW", "MEDIUM", "HIGH"];
  listOfProjectStatus: any = ["PENDING", "INPROGRESS", "COMPLETED", "DEFERRED", "CANCELLED"];


  constructor(private service:AdminService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminService:AdminService,
    private snackBar:MatSnackBar,
    private router : Router
  ){
    this.getProjectById();
    this.getUsers();
    this.updateProjectForm = this.fb.group({
      employeeId:[null, [Validators.required]],
      title:[null, [Validators.required]],
      description:[null, [Validators.required]],
      dueDate:[null, [Validators.required]],
      priority:[null, [Validators.required]],
      projectStatus:[null, [Validators.required]],
    })
  }

  getProjectById(){
     this.service.getProjectById(this.id).subscribe((res) => {
      this.updateProjectForm.patchValue(res);
      console.log(res);
     })
  }

  getUsers(){
    this.adminService.getUsers().subscribe((res)=>{
      this.listOfEmployees = res;
      console.log(res);
    })
  }

  updateProject(){
    
    this.adminService.updateProject(this.id,this.updateProjectForm.value).subscribe((res)=>{
      if(res.id !=null){
          this.snackBar.open("Project updated successfully","Close",{duration:5000});
          this.router.navigateByUrl("/admin/dashboard");
      } else{
        this.snackBar.open("Something went wrong","ERROR",{duration:5000});
      }
    })
  }

}
