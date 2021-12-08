import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UserStoryService } from "./user-story.service";
import { CreateOrEditCardComponent } from "./create-or-edit-card/create-or-edit-card.component";
import { ProjectsService } from "../projects.service";
import { AddOrEditBoardComponent } from "../add-or-edit-board/add-or-edit-board.component";

import { TranslateService } from '@ngx-translate/core';
import { Board, Card } from 'src/app/Types';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  nowPrj: any;
  boards: Board[] | null | undefined;
  nowPrd: any;
  usrStorys: any;

  private getRouteParams(param: string) {
    let r: ActivatedRoute | null = this.actRoute;
    while (r) {
      let id = r.snapshot.paramMap.get(param);
      if (id) return id;
      r = r.parent;
    }
    return "";
  }

  get nowPrjID() { return this.getRouteParams("prjID"); }
  get nowPrdID() { return this.nowPrd?._id; }
  set nowPrdID(prdID) {
    if (this.nowPrdID == prdID) return;
    let board = this.nowPrd = this.boards?.find(board => board._id == prdID);
    this.usrStorys = board?.cards;
    this.usrStorys.sort((s1: { createdTime: number; }, s2: { createdTime: number; }) => s1.createdTime - s2.createdTime);
    this.usService.setCurrentPrjId(this.nowPrjID);
    this.usService.setCurrentBoardId(board?._id);
  }

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private actRoute: ActivatedRoute,
    public translate: TranslateService,
    public usService: UserStoryService,
    public prjsService: ProjectsService,
  ) {
    translate.setTranslation("en", {
      "product_board": {
        "breadcrumb_nav": "Product Backlog",
      },
    }, true);
    translate.setTranslation("zh_cn", {
      "product_board": {
        "breadcrumb_nav": "产品代办列表",
      },
    }, true);
  }

  async ngOnInit() {
    this.nowPrj = await this.prjsService.getProjectById(this.nowPrjID);
    this.boards = await this.prjsService.getAllBoardByCurrentPrj();
    this.nowPrdID = this.getRouteParams("prdID");
    this.actRoute.params.subscribe(params => {
      this.nowPrdID = params["prdID"];
    });
    // TODO: OnCreateBoardListener

    // TODO: OnCreateCardListener
    // TODO: OnUpdateCardListener
    // TODO: OnDeleteCardListener
  }

  onCreateUsrStory() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = { boardId: this.nowPrdID, };
    this.dialog.open(CreateOrEditCardComponent, dialogConfig);
  }

  onModifyUsrStory(usrStory: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = usrStory;
    this.dialog.open(CreateOrEditCardComponent, dialogConfig);
  }

  onRemoveUsrStory(usrStory: any, event: { stopPropagation: () => void; }) {
    if (event) event.stopPropagation();
    this.usService.removeCard(usrStory);
  }

  onEditBoard(nowPrd = this.nowPrd) {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = {
      project: this.prjsService.currentPrj,
      board: nowPrd,
    };
    const dialogRef = this.dialog.open(AddOrEditBoardComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(board => {
      // console.log('The dialog was closed', board);
      if (!board) return;
      if (board.delete) {
        this.router.navigateByUrl(`/prj/${this.nowPrjID}`);
        return;
      }
      this.translate.use(this.translate.currentLang || this.translate.defaultLang);
    });
  }
}
