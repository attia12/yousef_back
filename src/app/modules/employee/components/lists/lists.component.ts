import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';

// Déclaration de l'interface à l'extérieur de la classe
interface SideNavToggle {
  screenwidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'  
})
export class ListsComponent implements OnInit {

  innerWidth: number | undefined;
  isSideNavCollapsed = false;
  screenWidth = 0;
  listOfProjects: any[] = [];  // Spécification du type tableau d'objets

  constructor(private service: EmployeeService) {}

  ngOnInit(): void {
    this.getProjects();  // Déplacement de l'appel à getProjects() dans ngOnInit()
  }

  onToggleSideNav(eventData: SideNavToggle): void {
    this.screenWidth = eventData.screenwidth;
    this.isSideNavCollapsed = eventData.collapsed;
  }

  getProjects(): void {
    this.service.getEmployeeProjectsById().subscribe((res) => {
      console.log(res);
      this.listOfProjects = res;
    });
  }
}
