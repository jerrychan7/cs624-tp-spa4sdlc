import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

import { LoadingScreenComponent } from '../loading-screen/loading-screen.component';
import { ProjectsComponent } from './projects.component';
import { AddOrEditBoardComponent } from './add-or-edit-board/add-or-edit-board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrjInfoComponent } from './prj-info/prj-info.component';
import { ProductComponent } from './product/product.component';
import { SprintComponent } from './sprint/sprint.component';
import { ProjectCreateOrModifyComponent } from './dashboard/project-create-or-modify/project-create-or-modify.component';


@NgModule({
  declarations: [
    LoadingScreenComponent,
    ProjectsComponent,
    AddOrEditBoardComponent,
    DashboardComponent,
    PrjInfoComponent,
    ProductComponent,
    SprintComponent,
    ProjectCreateOrModifyComponent,
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    TranslateModule.forChild({
      defaultLanguage: "en",
    }),

    MatDialogModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
  ]
})
export class ProjectsModule { }
