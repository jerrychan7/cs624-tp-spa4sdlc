import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxEchartsModule } from "ngx-echarts";

import { ProjectsRoutingModule } from './projects-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';

import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { LoadingScreenComponent } from '../loading-screen/loading-screen.component';
import { ProjectsComponent } from './projects.component';
import { AddOrEditBoardComponent } from './add-or-edit-board/add-or-edit-board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrjInfoComponent } from './prj-info/prj-info.component';
import { ProductComponent } from './product/product.component';
import { SprintComponent } from './sprint/sprint.component';
import { ProjectCreateOrModifyComponent } from './dashboard/project-create-or-modify/project-create-or-modify.component';
import { CreateOrEditCardComponent } from './product/create-or-edit-card/create-or-edit-card.component';
import { DashboardComponent as SprintDashboardComponent } from './sprint/dashboard/dashboard.component';


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
    CreateOrEditCardComponent,
    SprintDashboardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    DragDropModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    ProjectsRoutingModule,
    TranslateModule.forChild({
      defaultLanguage: "en",
    }),

    MatAutocompleteModule,

    MatFormFieldModule,
    MatDialogModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatGridListModule,
    MatProgressBarModule,
    MatButtonModule,
    MatStepperModule,
    MatToolbarModule,
    MatRadioModule,

    MatInputModule,
    MatCheckboxModule,
    MatRippleModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ]
})
export class ProjectsModule { }
