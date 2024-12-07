import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import e from 'express';
import { DashboardComponent } from './modules/employee/components/dashboard/dashboard.component';
import { ProductsComponent } from './modules/employee/components/products/products.component';
import { ListsComponent } from './modules/employee/components/lists/lists.component';
import { ChatComponent } from './modules/employee/components/chat/chat.component';
import {TestComponent} from "./auth/components/test/test.component";
import {maslGuard} from "./masl.guard";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "admin", loadChildren: () => import("./modules/admin/admin.module").then(e => e.AdminModule) },
  { path: "employee", loadChildren: () => import("./modules/employee/employee.module").then(e => e.EmployeeModule) },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'products', component: ProductsComponent},
  { path: 'chat', component: ChatComponent},
  { path: 'lists', component: ListsComponent},
  {path:'calendar',component:TestComponent}
  // { path: '', redirectTo: 'dashboard', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
