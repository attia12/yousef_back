
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListsComponent } from './components/lists/lists.component';
import { ProductsComponent } from './components/products/products.component';
import { ChatComponent } from './components/chat/chat.component';
import {CalendarMeetingComponent} from "./components/calendar-meeting/calendar-meeting.component";

const routes: Routes = [
  {path: "dashboard", component: DashboardComponent},
  { path: 'products', component: ProductsComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'lists', component: ListsComponent },
  {path:'meeting',component:CalendarMeetingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
