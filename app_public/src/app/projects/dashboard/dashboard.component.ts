import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from '@ngx-translate/core';
import { ProjectsService } from "../projects.service";
import { ProjectCreateOrModifyComponent } from "./project-create-or-modify/project-create-or-modify.component";
import { Project } from '../../Types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  get projects() { return this.prjsService.currentPrjs; }

  constructor(
    private dialog: MatDialog,
    public prjsService: ProjectsService,
    public translate: TranslateService,
  ) {
    translate.setTranslation("en", {
      "project_dashboard": {
        "title": "Project",
        "setting": "Setting",
        "remove": "Remove",
        "no_prj1": "You currently have no projects",
        "no_prj2": "Let's create your first project",
        "create_prj_btn": "Create project",
      }
    }, true);
    translate.setTranslation("zh_cn", {
      "project_dashboard": {
        "title": "项目列表",
        "setting": "设置",
        "remove": "删除",
        "no_prj1": "您目前没有项目",
        "no_prj2": "让我们创建您的第一个项目",
        "create_prj_btn": "新建项目",
      }
    }, true);
  }

  async ngOnInit() {
    await this.prjsService.getAllProjectsByCurrentUser();
  }

  onCreateProject() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = {};
    this.dialog.open(ProjectCreateOrModifyComponent, dialogConfig);
  }

  onModifyProject(prj: Project | null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = prj;
    this.dialog.open(ProjectCreateOrModifyComponent, dialogConfig);
  };

  async onRemoveProject(prj: Project) {
    await this.prjsService.deleteProject(prj);
  }

}
