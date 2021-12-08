import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [{
  path: "", redirectTo: "prj", pathMatch: "full",
}, {
  path: 'prj',
  loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
  canActivate: [AuthGuard],
}, {
  path: "usr",
  loadChildren: () => import('./user/user.module').then(m => m.UserModule),
}, ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
