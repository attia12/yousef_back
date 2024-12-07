import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { EmployeeService } from '../modules/employee/services/employee.service';
import { StorageService } from '../auth/services/storage/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  formGroup: FormGroup;
  user: any;
  id: string = '1';

  constructor(fb: FormBuilder, private service: EmployeeService) {
    this.formGroup = fb.group({
      name: fb.control('', Validators.required),
      email: fb.control('', Validators.required),
    });
    this.getUser();
  }

  getUser() {
    this.service.getEmployeById(this.id).subscribe((res) => {
      this.user = res;
      this.formGroup.reset({ name: res?.name, email: res?.email });
    });
  }

  ngOnInit(): void {
    this.getUser();
  }

  onSubmit() {
    this.service
      .updateprofile(this.formGroup.value, StorageService.getUser()?.id ? Number(StorageService.getUser()?.id) : 0)
      .subscribe((res) => {
        this.user = res;
        this.formGroup.reset({ name: res?.name, email: res?.email });
      });
  }
}
