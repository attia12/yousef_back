import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdminService} from "../../services/admin.service";

@Component({
  selector: 'app-meeting-dialog',
  templateUrl: './meeting-dialog.component.html',
  styleUrl: './meeting-dialog.component.scss'
})
export class MeetingDialogComponent implements OnInit{
  meetingForm: FormGroup;
  employees: any[] = []; // Add your employee list here

  constructor(
    public dialogRef: MatDialogRef<MeetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.meetingForm = this.fb.group({
      employeeId: [null, Validators.required],
      description: ['', Validators.required],
      date: [this.data.selectedDate, Validators.required],  // Date form control
      time: ['', Validators.required],  // Time form control
      isOnline: [false],
      meetLink: [''],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.meetingForm.valid) {

      const meetingData = this.meetingForm.value;
      const payload = {
        ...meetingData,
        online: meetingData.isOnline,
      };


      this.adminService.createMeeting(payload).subscribe(
        (response) => {
          console.log('Meeting created:', response);
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error creating meeting:', error);
        }
      );
     }
  }

  ngOnInit(): void {
    this.loadEmployees();


  }

  private loadEmployees() {
    this.adminService.getUsers().subscribe(
      (users) => {
        this.employees = users; // Assuming employees are returned as users
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }


}
