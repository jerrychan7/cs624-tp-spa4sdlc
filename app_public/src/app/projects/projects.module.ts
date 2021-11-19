import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';


import { ProjectsComponent } from './projects.component';
import { AddOrEditBoardComponent } from './add-or-edit-board/add-or-edit-board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrjInfoComponent } from './prj-info/prj-info.component';
import { ProductComponent } from './product/product.component';
import { SprintComponent } from './sprint/sprint.component';


@NgModule({
  declarations: [
    ProjectsComponent,
    AddOrEditBoardComponent,
    DashboardComponent,
    PrjInfoComponent,
    ProductComponent,
    SprintComponent,
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
  ]
})
export class ProjectsModule { }
