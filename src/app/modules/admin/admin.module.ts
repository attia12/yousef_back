import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostProjectComponent } from './components/post-project/post-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { UpdateProjectComponent } from './components/update-project/update-project.component';
import { ViewProjectDetailsComponent } from './components/view-project-details/view-project-details.component';
import { ChatAdminComponent } from './components/chat-admin/chat-admin.component';
import {MatButton, MatIconButton} from "@angular/material/button";
import { MeetingDialogComponent } from './components/meeting-dialog/meeting-dialog.component';
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatCheckbox} from "@angular/material/checkbox";
import { BestUserComponent } from './components/best-user/best-user.component';
import {NgFireworksModule} from "@fireworks-js/angular";




@NgModule({
  declarations: [
    DashboardComponent,
    PostProjectComponent,
    UpdateProjectComponent,
    ViewProjectDetailsComponent,
    ChatAdminComponent,
    MeetingDialogComponent,
    BestUserComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatIconButton,
    MatButton,
    MatSlideToggle,
    MatDialogContent,
    MatCheckbox,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    NgFireworksModule,



  ]
})
export class AdminModule { }
