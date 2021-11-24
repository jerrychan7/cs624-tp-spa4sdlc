import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './auth.guard';

const routes: Routes = [{
  path: "", redirectTo: "prj", pathMatch: "full",
}, {
  path: 'prj',
  loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
  canActivate: [LoginGuard],
}, {
  path: "user",
  loadChildren: () => import('./user/user.module').then(m => m.UserModule),
}, ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
