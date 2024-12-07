import { Component, HostListener, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Task } from '../../Models/task';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../../../auth/services/storage/storage.service';
import { EmployeeService } from '../../services/employee.service';
import {AdminService} from "../../../admin/services/admin.service";



interface SideNavToggle {
  screenwidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  todoForm!: FormGroup;
  tasks: Task[] = [];
  inprogress: Task[] = [];
  done: Task[] = [];
  projects:any=[];
  isActive:boolean=false;

  isEditEnabled: boolean = false;
  updatedTask: Task | any;
  currentUser: any;
userIdFromToken:any;
  innerWidth: any;
  private selectedProjectId: any;
  selectedProjectTitle: string | null = null;


  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private adminService:AdminService
  ) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.todoForm = this.fb.group({
      item: ['', Validators.required],
    });
    this.currentUser = StorageService.getUser();

    // this.getTasksByuser_id(
    //   StorageService.getUser()?.id ? Number(StorageService.getUser()?.id) : 0
    // );
    this.loadProjectByUserId();
  }

  getTasksByuser_id(id: number) {
    this.employeeService.getTasksByUserId(id).subscribe((res) => {
      console.log(res);

      this.tasks = res
        .filter((el: any) => el?.type === 'todo')
        .map((el: any) => ({
          ID: el.id,
          Title: el?.title,
          user_id: el?.user_id,
          Description: el?.description,
          id: el?.id ?? 0,
          Type: 'todo',
        }));
      this.inprogress = res
        .filter((el: any) => el?.type === 'inprogress')
        .map((el: any) => ({
          ID: el.id,
          Title: el?.title,
          user_id: el?.user_id,
          Description: el?.description,
          id: el?.id ?? 0,
          Type: 'inprogress',
        }));
      this.done = res
        .filter((el: any) => el?.type === 'done')
        .map((el: any) => ({
          ID: el.id,
          Title: el?.title,
          user_id: el?.user_id,
          Description: el?.description,
          id: el?.id ?? 0,
          Type: 'done',
        }));
    });
  }

  addTask() {

    const now = new Date();
    const isoString = now.toISOString();

    if (this.todoForm.valid && this.isActive && this.selectedProjectId) {
      const task = {
        title: this.todoForm.value.item,
        user_id: this.currentUser?.id ?? 0,
        type: 'todo',
        dueDate: isoString,
        description: this.todoForm.value.item
      };

      this.employeeService.addTaskToProject(task, this.selectedProjectId).subscribe({
        next: (res) => {
          console.log('Task added:', res);


          this.tasks.push({
            Title: this.todoForm.value.item,
            Completed: false,
            user_id: this.currentUser?.id ?? 0,
            id: Number(res) ?? 0,
            Type: 'todo',

          });



          this.todoForm.reset();
          this.isActive = false;
          this.selectedProjectId = null;
        },
        error: (error) => {
          console.error('Error adding task:', error);
        }
      });
    } else {
      console.error('Form is invalid or no project selected');
    }

  }

  updateTask() {
    this.employeeService
      .updateTask(
        {
          title: this.todoForm.value.item,
          user_id: this.currentUser?.id ?? 0,
          type: this.updatedTask?.Type,
          description: this.todoForm.value.item,
        },
        this.updatedTask?.id
      )
      .subscribe((res) => {
        console.log('testttttttt', res);

        if (this.updatedTask.Type === 'todo') {
          const index = this.tasks.findIndex(
            (task) => task.id === this.updatedTask.id
          );
          this.tasks[index].Title = this.todoForm.value.item;
          this.tasks[index].Completed = false;
        } else if (this.updatedTask.Type === 'inprogress') {
          const index = this.inprogress.findIndex(
            (task) => task.id === this.updatedTask.id
          );
          this.inprogress[index].Title = this.todoForm.value.item;
          this.inprogress[index].Completed = false;
        } else if (this.updatedTask.Type === 'done') {
          const index = this.done.findIndex(
            (task) => task.id === this.updatedTask.id
          );
          this.done[index].Title = this.todoForm.value.item;
          this.done[index].Completed = false;
        }
        this.todoForm.reset();
        // this.updatedTask = undefined;
        this.isEditEnabled = false;
      });
  }

  deleteTask(task: Task) {
    this.employeeService.deleteTask(task.id).subscribe((res) => {
      this.tasks = this.tasks.filter((el) => el.id !== task.id);
    });
  }
  deleteInprogressTask(task: Task) {
    this.employeeService.deleteTask(task.id).subscribe((res) => {
      this.inprogress = this.inprogress.filter((el) => el.id !== task.id);
    });
  }
  deleteDoneTask(task: Task) {
    this.employeeService.deleteTask(task.id).subscribe((res) => {
      this.done = this.done.filter((el) => el.id !== task.id);
    });
  }

  onEditTask(task: Task, TaskId: number) {
    this.todoForm.controls['item'].setValue(task.Title);
    this.updatedTask = task;
    this.isEditEnabled = true;
  }

  // drop(event: CdkDragDrop<Task[]>) {
  //   console.log('testttttttt', event);
  //
  //   if (event.previousContainer === event.container) {
  //     console.log('testttttttt--------------');
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   } else {
  //     this.employeeService
  //       .updateTask(
  //         {
  //           title: event.item.data?.Title,
  //           user_id: event.item?.data.user_id,
  //           type:
  //             event.container.id === 'cdk-drop-list-0'
  //               ? 'todo'
  //               : event.container.id === 'cdk-drop-list-1'
  //               ? 'inprogress'
  //               : 'done',
  //           description: event.item.data?.Description,
  //         },
  //         event.item.data?.id
  //       )
  //       .subscribe((res) => {
  //         // this.getTasksByuser_id(
  //         //   StorageService.getUser()?.id ? Number(StorageService.getUser()?.id) : 0
  //         // );
  //
  //
  //         transferArrayItem(
  //           event.previousContainer.data,
  //           event.container.data,
  //           event.previousIndex,
  //           event.currentIndex
  //         );
  //       });
  //   }
  // }
  drop(event: CdkDragDrop<Task[]>) {
    console.log('Drag and drop event:', event);

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Update the task type based on where it was dropped
      const newType = event.container.id === 'cdk-drop-list-0' ? 'todo' :
        event.container.id === 'cdk-drop-list-1' ? 'inprogress' : 'done';

      // Update the task in the backend
      this.employeeService
        .updateTask(
          {
            title: event.item.data?.Title,
            user_id: event.item?.data.user_id,
            type: newType, // Change the type based on drop location
            description: event.item.data?.Description,
          },
          event.item.data?.id
        )
        .subscribe((res) => {
          console.log('Task updated successfully:', res);

          // Reflect the changes in the local memory (move task between arrays)
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  getClass() {
    return this.innerWidth < 925 ? 'row-md' : 'row';
  }

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(eventData: SideNavToggle) {
    this.screenWidth = eventData.screenwidth;
    this.isSideNavCollapsed = eventData.collapsed;
    // Logique de gestion de l'ouverture/fermeture du menu latéral
    // Vous pouvez utiliser eventData.screenwidth et eventData.collapsed ici
  }


  private loadProjectByUserId() {
    const userId = this.currentUser?.id || StorageService.getUserIdFromToken();
    if (userId) {

      this.adminService.getProjectsByUserId(userId).subscribe((res: any) => {
        console.log(res)
        this.projects = res;

      }, error => {
        console.log(error)
      })
    }
  }

  // addTaskInProject(project: any) {
  //   this.isActive=true;
  //   this.selectedProjectId = project.id;
  //   this.selectedProjectTitle = project.title;
  //   this.loadProjectByUserId();
  //
  //   if (project.tasks && project.tasks.length > 0) {
  //
  //     this.tasks = project.tasks
  //       .filter((task: any) => task.type === 'todo')
  //       .map((task: any) => ({
  //         id: task.id,
  //         Title: task.title, // Ensure Title is correctly set
  //         user_id: task.user_id,
  //         Description: task.description,
  //         Type: task.type,
  //         dueDate: task.dueDate,
  //       }));
  //
  //     this.inprogress = project.tasks
  //       .filter((task: any) => task.type === 'inprogress')
  //       .map((task: any) => ({
  //         id: task.id,
  //         Title: task.title, // Ensure Title is correctly set
  //         user_id: task.user_id,
  //         Description: task.description,
  //         Type: task.type,
  //         dueDate: task.dueDate,
  //       }));
  //
  //     this.done = project.tasks
  //       .filter((task: any) => task.type === 'done')
  //       .map((task: any) => ({
  //         id: task.id,
  //         Title: task.title, // Ensure Title is correctly set
  //         user_id: task.user_id,
  //         Description: task.description,
  //         Type: task.type,
  //         dueDate: task.dueDate,
  //       }));
  //   } else {
  //     this.tasks = [];
  //     this.inprogress = [];
  //     this.done = [];
  //   }
  //
  //
  //
  // }
  addTaskInProject(project: any) {
    this.isActive = true;
    this.selectedProjectId = project.id;
    this.selectedProjectTitle = project.title;

    // Load project tasks either from memory or backend
    this.loadProjectByUserId();

    if (project.tasks && project.tasks.length > 0) {
      this.tasks = project.tasks
        .filter((task: any) => task.type === 'todo')
        .map((task: any) => ({
          id: task.id,
          Title: task.title,
          user_id: task.user_id,
          Description: task.description,
          Type: task.type,
          dueDate: task.dueDate,
        }));

      this.inprogress = project.tasks
        .filter((task: any) => task.type === 'inprogress')
        .map((task: any) => ({
          id: task.id,
          Title: task.title,
          user_id: task.user_id,
          Description: task.description,
          Type: task.type,
          dueDate: task.dueDate,
        }));

      this.done = project.tasks
        .filter((task: any) => task.type === 'done')
        .map((task: any) => ({
          id: task.id,
          Title: task.title,
          user_id: task.user_id,
          Description: task.description,
          Type: task.type,
          dueDate: task.dueDate,
        }));
    } else {
      this.tasks = [];
      this.inprogress = [];
      this.done = [];
    }
  }

  downloadPdf() {
    this.employeeService.downloadProjectPdf(this.selectedProjectId).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });

  }
}
