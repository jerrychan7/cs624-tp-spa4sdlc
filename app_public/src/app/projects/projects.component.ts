import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from '@ngx-translate/core';
import { ProjectsService } from './projects.service';
import { AddOrEditBoardComponent } from './add-or-edit-board/add-or-edit-board.component';
import { Board, BoardCategory } from '../Types';
import { BoardsService } from './add-or-edit-board/boards.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  get isPrjDB(): boolean {
    return this.location.path() == "/prj/dashboard";
  };
  get prds() { return this.boardService.prds; }
  get sprs() { return this.boardService.sprs; }
  get archive() { return this.boardService.archive; }

  @ViewChild("sideNav")
  public sideNav!: MatDrawer;

  constructor(
    private location: Location,
    private dialog: MatDialog,
    public translate: TranslateService,
    private boardService: BoardsService,
    private prjsService: ProjectsService,
    private router: Router,
  ) {
    translate.setTranslation("en", {
      "sideNav": {
        "projects": "Projects",
        "product_backlog": "Product Backlog",
        "sprint_backlog": "Sprint Backlog",
        "archive": "Archived",
        "create_new_board": "Create new board",
      }
    }, true);
    translate.setTranslation("zh_cn", {
      "sideNav": {
        "projects": "项目列表",
        "product_backlog": "产品待办列表",
        "sprint_backlog": "Sprint 待办列表",
        "archive": "归档",
        "create_new_board": "创建新板块",
      }
    }, true);
  }

  ngOnInit(): void {}

  ngOnDestroy() {}

  onCreateBoard() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = { project: this.prjsService.currentPrj };
    const dialogRef = this.dialog.open(AddOrEditBoardComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async board => {
      if (!board) return;
      this.router.navigateByUrl(`/prj/${
        this.prjsService.currentPrj?._id || ""}/${
          board.category === BoardCategory.PRODUCT? "prd": "spr"}/${
            board._id}`);
    });
  }
}
