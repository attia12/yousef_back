import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostProjectComponent } from './components/post-project/post-project.component';
import { UpdateProjectComponent } from './components/update-project/update-project.component';
import { ViewProjectDetailsComponent } from './components/view-project-details/view-project-details.component';
import { ChatAdminComponent } from './components/chat-admin/chat-admin.component';
import {BestUserComponent} from "./components/best-user/best-user.component";

const routes: Routes = [
  {path:"dashboard", component: DashboardComponent},
  {path:"chat", component: ChatAdminComponent},
  {path:"project", component: PostProjectComponent},
  {path:"project/:id/edit", component: UpdateProjectComponent},
  {path:"project-details/:id", component: ViewProjectDetailsComponent},
  {path:"bestuser",component:BestUserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
