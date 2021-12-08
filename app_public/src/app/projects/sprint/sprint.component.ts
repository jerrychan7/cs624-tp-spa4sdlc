import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from "../projects.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AddOrEditBoardComponent } from "../add-or-edit-board/add-or-edit-board.component";
import { TranslateService } from '@ngx-translate/core';
import { Board, BoardCategory, Card, CardStatus } from 'src/app/Types';
import { UserStoryService } from '../product/user-story.service';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit {

  nowPrj: any;
  boards: Board[] | null | undefined;
  nowSpr: any;
  allUsrStorys: any;
  swimlane:any = [];
  showList = false;
  nowLane: any;

  constructor(
    private actRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    public prjsService: ProjectsService,
    public usService: UserStoryService,
    private dialog: MatDialog,
    public translate: TranslateService,
  ) {
    translate.setTranslation("en", {
      "sprint_board": {
        "breadcrumb_nav": "Sprint Backlog",
        "dashboard": "Dashboard",
      },
    }, true);
    translate.setTranslation("zh_cn", {
      "sprint_board": {
        "breadcrumb_nav": "Sprint代办列表",
        "dashboard": "仪表盘",
      },
    }, true);
  }

  usrStoryTimer(us: any) {
    return window.setInterval(() => {
      const tt = Math.floor((new Date()).getTime() / 1000);
      const currentDuration = Math.min(us.totalTime,
        Math.floor((us.currentDuration || 0) + tt - us.lastActivityAt));
      // us.currentDuration = currentDuration;
      // us.lastActivityAt = tt;
      const tt2s = (tt = 0) => {
        const td = Math.floor(tt / 60 / 60 / 24),
              th = Math.floor(tt / 60 / 60) - td * 24,
              tm = Math.floor(tt / 60) - td * 24 * 60 - th * 60;
        return ((td? td + " day" + (td > 1? "s": "") + " ": "") +
                (th? th + " hour" + (th > 1? "s": "") + " ": "") +
                (tm? tm + " minute" + (tm > 1? "s": ""): "")) || "0";
      };
      us.currentDurationString = tt2s(currentDuration);
    }, 1000);
  }

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
  get nowSprID() { return this.nowSpr?._id; }
  set nowSprID(sprID) {
    if (this.nowSprID == sprID) return;
    let board = this.nowSpr = this.boards?.find(board => board._id == sprID);
    // console.log(board, this);
    this.allUsrStorys = this.boards
      ?.reduce((arr: Array<any>, board) => { arr.push(...(board.cards || [])); return arr; }, [])
      ?.filter(card => card.board.category === BoardCategory.PRODUCT? true: card.belongCardId)
      ?.sort((c1: any, c2: any) => c1.createdTime - c2.createdTime);
    let usrStorys = board?.cards;
    this.swimlane = <any>usrStorys?.filter(us => !us.belongCardId).map((card: any) => {
      card.usrStorys = usrStorys?.filter(us => us.belongCardId === card._id);
      card.usrStorys.forEach((us: Card | any) => {
        if (us.status == CardStatus.STOP) return;
        us.timer = this.usrStoryTimer(us);
      });
      return card;
    }).sort((us1, us2) => us1.createdTime - us2.createdTime);
    this.usService.setCurrentPrjId(this.nowPrjID);
    this.usService.setCurrentBoardId(board?._id);
  }
  async ngOnInit() {
    this.nowPrj = await this.prjsService.getProjectById(this.nowPrjID);
    this.boards = await this.prjsService.getAllBoardByCurrentPrj();
    this.nowSprID = this.getRouteParams("sprID");
    this.actRoute.params.subscribe(params => {
      this.nowSprID = params["sprID"];
    });
    // TODO: OnCreateCardListener
    // TODO: OnUpdateCardListener
    // TODO: OnDeleteCardListener
  }

  get otherUsrStorys(): any {
    let others = this.allUsrStorys.filter((card: any) => card.board.category === BoardCategory.PRODUCT);
    return others;
  }
  onShowList(lane: any) {
    this.showList = true;
    this.nowLane = lane;
  }
  onCloseList() {
    this.showList = false;
  }
  async addUsrStory(usrStory: any) {
    return this.addUsrStorys([usrStory]);
  }
  async addSelectedUsrStorys(MatListOptions: any) {
    return this.addUsrStorys(MatListOptions.map((o: any) => o.value));
  }
  async addUsrStorys(usrStorys: any[]) {
    if (!usrStorys.length) return;
    usrStorys = await Promise.all(usrStorys.map(async usrStory => {
      this.usService.setCurrentBoardId(usrStory.boardId);
      usrStory = await this.usService.modifyCard({
        _id: usrStory._id,
        belongCardId: this.nowLane._id,
        boardId: this.nowSpr._id,
        title: usrStory.title,
      });
      this.usService.setCurrentBoardId(this.nowSpr._id);
      return usrStory;
    }));
    let uss = usrStorys.filter(u => typeof u == "string");
    if (uss.length) this.snackBarRef = this.snackBar.open(uss[0], "OK");
    else {
      this.nowLane.usrStorys.push(...usrStorys);
      this.onCloseList();
    }
  }

  drop(event: any) {
    const pid = event.previousContainer.data, cid = event.container.data;
    const p = this.swimlane.find((l: any) => l._id === pid)?.usrStorys,
          c = this.swimlane.find((l: any) => l._id === cid)?.usrStorys,
          card = p[event.previousIndex];
    p.splice(event.previousIndex, 1);
    c.splice(event.currentIndex, 0, card);
    if (event.previousContainer === event.container) return;
    this.usService.modifyCard({
      _id: card._id,
      belongCardId: cid,
    });
  }

  async onStart(usrStory: any) {
    const time = Math.floor((new Date()).getTime() / 1000);
    usrStory.status = CardStatus.DOING;
    usrStory.lastActivityAt = time;
    usrStory = await this.usService.modifyCard({
      _id: usrStory._id,
      status: CardStatus.DOING,
      lastActivityAt: usrStory.lastActivityAt,
    });
    usrStory.timer = this.usrStoryTimer(usrStory);
  }
  async onStop(usrStory: any) {
    const time = Math.floor((new Date()).getTime() / 1000);
    usrStory.status = CardStatus.STOP;
    usrStory.currentDuration = Math.min(usrStory.totalTime,
      Math.floor((usrStory.currentDuration || 0) + time - usrStory.lastActivityAt));
    usrStory.lastActivityAt = time;
    window.clearInterval(usrStory.timer);
    usrStory = await this.usService.modifyCard({
      _id: usrStory._id,
      currentDuration: usrStory.currentDuration,
      status: CardStatus.STOP,
      lastActivityAt: usrStory.lastActivityAt,
    });
  }

  onEditBoard(nowSpr = this.nowSpr) {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = {
      project: this.prjsService.currentPrj,
      board: nowSpr,
    };
    const dialogRef = this.dialog.open(AddOrEditBoardComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(board => {
      // console.log('The dialog was closed', board);
      if (!board) return;
      if (board.delete) {
        this.router.navigateByUrl(`/prj/${this.nowPrjID}/spr/${
          this.boards?.filter(b => b.category == BoardCategory.SPRINT)[0]?._id ?? ""
        }`);
        return;
      }
      // this.nowSpr.name = board.name;
      // this.nowSpr.description = board.description;
      this.router.navigateByUrl(`/prj/${this.nowPrjID}/${
        board.category == BoardCategory.ARCHIVE? "archive": "spr"}/${board._id}`);
    });
  }

  snackBarRef: any;
  ngOnDestroy() {
    this.snackBarRef?.closeWithAction();
  }
}
