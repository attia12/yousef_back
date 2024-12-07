import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StorageService } from './auth/services/storage/storage.service';
import { Router } from '@angular/router';

interface SideNavToggle {
  screenwidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Task_Management';
  isEmployeeLoggedIn: boolean = StorageService.isEmployeeLoggedIn();
  isAdminLoggedIn: boolean = StorageService.isAdminLoggedIn();
  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor(private router: Router){}

  ngOnInit(){
    this.router.events.subscribe(event=> {
      this.isEmployeeLoggedIn = StorageService.isEmployeeLoggedIn();
      this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
    })
  }

  logout(){
    StorageService.logout();
    this.router.navigateByUrl("/login");
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenwidth;
    this.isSideNavCollapsed = data.collapsed;

  }
  
}
