import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsComponent } from './projects.component';
import { PrjInfoComponent } from "./prj-info/prj-info.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProductComponent } from './product/product.component';
import { SprintComponent } from './sprint/sprint.component';
import { DashboardComponent as SprintDashboardComponent } from "./sprint/dashboard/dashboard.component";

// https://ultimatecourses.com/blog/angular-parent-routing-params
const routes: Routes = [{
  path: "",
  component: ProjectsComponent,
  children: [
    { path: "", redirectTo: "dashboard", pathMatch: "full", },
    { path: "dashboard", component: DashboardComponent, },
  ],
}, {
  path: ":prjID",
  component: ProjectsComponent,
  children: [
    { path: "", redirectTo: "info", pathMatch: "full", },
    { path: "info", component: PrjInfoComponent, },
    { path: "prd/:prdID", component: ProductComponent, },
    { path: "spr",
      children: [{
        path: ":sprID", children: [
          { path: "", component: SprintComponent, },
          { path: "dashboard", component: SprintDashboardComponent, },
        ],
      }, ],
    }, {
      path: "archive",
      children: [{
        path: ":sprID", children: [
          { path: "", component: SprintComponent, },
          { path: "dashboard", component: SprintDashboardComponent, },
        ],
      }, ],
    },
  ],
}, ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
