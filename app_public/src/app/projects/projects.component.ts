import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from '@ngx-translate/core';
import { ProjectsService } from './projects.service';
import { AddOrEditBoardComponent } from './add-or-edit-board/add-or-edit-board.component';

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
    private prjsService: ProjectsService,
    private router: Router,
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

  async initBoard() {
    let boards = await this.prjsService.getAllBoardByCurrentPrj();
    if (!boards) return;
    this.sprs = []; this.prds = [];
    boards.forEach(board => {
      switch(board.category) {
      case "Product":
        this.prds.push(board);
        break;
      case "Sprint":
        this.sprs.push(board);
        break;
      }
    });
    this.sprs.sort((a, b) => a.createdTime - b.createdTime);
    this.prds.sort((a, b) => a.createdTime - b.createdTime);
  }

  ngOnInit(): void {
    this.prjsService.onProjectChange(async (prj: any) => {
      if (!prj) return;
      await this.initBoard();
    });
    // TODO: OnDeleteBoardListener
  }

  onCreateBoard() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = { project: this.prjsService.currentPrj };
    const dialogRef = this.dialog.open(AddOrEditBoardComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async board => {
      if (!board) return;
      await this.initBoard();
      this.router.navigateByUrl(`/prj/${
        this.prjsService.currentPrj?.id || ""}/${
          board.category === "Product"? "prd": "spr"}/${
            board.id}`);
    });
  }
}
