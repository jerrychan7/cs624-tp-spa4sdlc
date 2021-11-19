import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { ProjectsComponent } from './projects/projects.component';
import { UserComponent } from './user/user.component';
import { AddOrEditBoardComponent } from './projects/add-or-edit-board/add-or-edit-board.component';
import { DashboardComponent } from './projects/dashboard/dashboard.component';
import { PrjInfoComponent } from './projects/prj-info/prj-info.component';
import { ProductComponent } from './projects/product/product.component';
import { SprintComponent } from './projects/sprint/sprint.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingScreenComponent,
    ProjectsComponent,
    UserComponent,
    AddOrEditBoardComponent,
    DashboardComponent,
    PrjInfoComponent,
    ProductComponent,
    SprintComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
