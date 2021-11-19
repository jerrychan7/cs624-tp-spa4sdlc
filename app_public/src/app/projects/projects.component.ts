import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  @ViewChild("sideNav")
  public sideNav!: MatDrawer;

  constructor(
    private dialog: MatDialog,
    public translate: TranslateService,
  ) {
    translate.setTranslation("en", {
      "sideNav": {
        "Project": "Project",
        "product_backlog": "Product Backlog",
        "sprint_backlog": "Sprint Backlog",
        "dashboard": "Dashboard",
        "create_new_board": "Create new board",
      }
    }, true);
    translate.setTranslation("zh_cn", {
      "sideNav": {
        "Project": "项目列表",
        "product_backlog": "产品待办列表",
        "sprint_backlog": "Sprint 待办列表",
        "dashboard": "仪表盘",
        "create_new_board": "创建新板块",
      }
    }, true);
  }

  prds: Array<any> = [];
  sprs: Array<any> = [];

  ngOnInit(): void {
  }

  onCreateBoard() {}
}
