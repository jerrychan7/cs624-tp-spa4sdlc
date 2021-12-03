import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UserStoryService } from "./user-story.service";
import { CreateOrEditCardComponent } from "./create-or-edit-card/create-or-edit-card.component";
import { ProjectsService } from "../projects.service";
import { AddOrEditBoardComponent } from "../add-or-edit-board/add-or-edit-board.component";

import { TranslateService } from '@ngx-translate/core';
import { Board, Card } from 'src/app/Types';

function getDateFromMilliseconds(ms: number | undefined | null): Date {
  let d = new Date(0);
  d.setMilliseconds(ms || 0);
  return d;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  nowPrjID: string | any;
  nowPrj: any;
  get nowPrdID() { return this.nowPrd?.id; }
  private boards: Board[] | null | undefined;
  set nowPrdID(prdID) {
    console.log(prdID, this.boards)
    // let board = this.nowPrd = prdID
    //   ? this.boards?.filter(board => board.id == prdID)[0]
    //   : this.boards?.filter(board => board.category === BoardCategory.Product)[0];
    let board = this.boards?.find(board => board.id == prdID);
    this.usrStorys = board?.cards?.map(this.iniCard);
    this.usrStorys.sort((s1: { createdTime: number; }, s2: { createdTime: number; }) => s1.createdTime - s2.createdTime);
    this.usService.setCurrentPrj(this.nowPrjID);
    this.usService.setCurrentBoard(board);
  }
  nowPrd: any;
  usrStorys: any;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    public prjsService: ProjectsService,
    private dialog: MatDialog, public usService: UserStoryService,
    public translate: TranslateService,
  ) {
    this.iniCard = this.iniCard.bind(this);
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

  iniCard(card: Card & {
    createdTime: Date,
    updatedTime: Date,
  } | any) {
    card.board = this.nowPrd;
    card.createdTime = getDateFromMilliseconds(card.createdAt);
    card.updatedTime = getDateFromMilliseconds(card.updatedAt);
    const td = Math.floor(card.totalTime / 60 / 60 / 24),
          th = Math.floor(card.totalTime / 60 / 60) - td * 24,
          tm = Math.floor(card.totalTime / 60) - td * 24 * 60 - th * 60;
    card.totalTimeString =
      (td? td + " day" + (td > 1? "s": "") + " ": "") +
      (th? th + " hour" + (th > 1? "s": "") + " ": "") +
      (tm? tm + " minute" + (tm > 1? "s": ""): "");
    return card;
  }

  async ngOnInit() {
    this.nowPrjID = this.actRoute.parent?.snapshot.paramMap.get('prjID');
    this.nowPrj = await this.prjsService.getProjectById(this.nowPrjID);
    let boards = await this.prjsService.getAllBoardByCurrentPrj();
    let prdID = this.actRoute.snapshot.paramMap.get("prdID");
    this.boards = boards;
    this.nowPrdID = prdID;
    console.log(this);
    this.actRoute.params.subscribe(params => {
      this.nowPrdID = params["prdID"];
    });
    // TODO: OnCreateBoardListener

    // TODO: OnCreateCardListener
    // TODO: OnUpdateCardListener
    // TODO: OnDeleteCardListener
  }

  onCreateUsrStory() {
    this.usService.setCurrentCard();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CreateOrEditCardComponent, dialogConfig);
  }

  onModifyUsrStory(usrStory: any) {
    this.usService.setCurrentCard(usrStory);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
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
        this.router.navigateByUrl(`/prj/${this.nowPrjID}/prd`);
        return;
      }
      // this.nowPrd.name = board.name;
      // this.nowPrd.description = board.description;
      this.router.navigateByUrl(`/prj/${this.nowPrdID}/prd/${board.id}`);
    });
  }
}
