import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/api.service';
import { Board, BoardCategory } from 'src/app/Types';
import { ProjectsService } from '../projects.service';

function getDateFromMilliseconds(ms: number | undefined | null): Date {
  let d = new Date(0);
  d.setMilliseconds(ms || 0);
  return d;
}

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  boards: Board[] | null | undefined;
  prds: Array<any> = [];
  sprs: Array<any> = [];
  archive: Array<any> = [];

  constructor(
    private api: ApiService,
    private prjService: ProjectsService,
    private translate: TranslateService,
  ) {
    this.initBoard = this.initBoard.bind(this);
    this.prjService.onProjectChange((prj: any) => {
      prj.boards = prj.boards || [];
      prj.boards.forEach((board: any) => {
        board.project = prj;
        this.initBoard(board);
      });
      this.initBoards(prj.boards);
      this.targetOnBoardChange(prj.boards);
    });
  }

  initBoard(board: Board & {
    createdTime: Date,
    updatedTime: Date,
  } | any) {
    board.createdTime = getDateFromMilliseconds(board.createdAt);
    board.updatedTime = getDateFromMilliseconds(board.updatedAt);
    board.cards = board.cards || [];
    board.cards.forEach((card: any) => {
      card.createdTime = getDateFromMilliseconds(card.createdAt);
      card.updatedTime = getDateFromMilliseconds(card.updatedAt);
      const tt2s = (tt = 0) => {
        const td = Math.floor(tt / 60 / 60 / 24),
              th = Math.floor(tt / 60 / 60) - td * 24,
              tm = Math.floor(tt / 60) - td * 24 * 60 - th * 60;
        return ((td? td + " day" + (td > 1? "s": "") + " ": "") +
                (th? th + " hour" + (th > 1? "s": "") + " ": "") +
                (tm? tm + " minute" + (tm > 1? "s": ""): "")) || "0";
      };
      card.totalTimeString = tt2s(card.totalTime);
      card.currentDurationString = tt2s(card.currentDuration);
      card.board = board;
    });
    board.cards.sort((a: any, b: any) => a.createdTime - b.createdTime);
    // Transfer the translation JSON in the board to the local translation service.
    try {
      if (!Number.isNaN(Number(board.name))) throw "is number";
      const name = JSON.parse(board.name),
            description = JSON.parse(board.description || "{}");
      Object.entries(name).forEach(([lang, tran]) => {
        if (lang === "default") return;
        this.translate.setTranslation(lang, {
          [board.category == BoardCategory.PRODUCT? "product_board": "sprint_board"]: {
            [board._id]: {
              name: tran,
              description: description[lang],
            }
          },
        }, true);
      });
      board.name = name[name.default];
      board.description = description[description.default];
      board.langs = {name, description};
    } catch(e) {
      this.translate.setTranslation(this.translate.currentLang || this.translate.defaultLang, {
        [board.category == BoardCategory.PRODUCT? "product_board": "sprint_board"]: {
          [board._id]: {
            name: board.name,
            description: board.description,
          }
        },
      }, true);
    }
    return board;
  }

  private async initBoards(boards: Board[] | null | undefined = undefined) {
    boards = this.boards = boards || await this.prjService.getAllBoardByCurrentPrj();
    if (!boards) return;
    this.sprs = []; this.prds = []; this.archive = [];
    boards.forEach(board => {
      switch(board.category) {
      case BoardCategory.PRODUCT:
        this.prds.push(board);
        break;
      case BoardCategory.SPRINT:
        this.sprs.push(board);
        break;
      case BoardCategory.ARCHIVE:
        this.archive.push(board);
        break;
      }
    });
    
    this.sprs.sort((a, b) => a.createdTime - b.createdTime);
    this.prds.sort((a, b) => a.createdTime - b.createdTime);
    this.archive.sort((a, b) => a.createdTime - b.createdTime);
  }

  private onBoardChangeCallbacks: Function[] = [];
  private onBoardChangeCallbacksID = 0;
  private onBoardChangeCallbacksMap = new Map();
  private targetOnBoardChange(boards: any) {
    (async (cbs) => {
      for (let cb of cbs)
        await cb(boards);
    })(this.onBoardChangeCallbacks);
  }
  onBoardChange(callback: Function) {
    // console.trace(callback);
    this.onBoardChangeCallbacks.push(callback);
    this.onBoardChangeCallbacksMap.set(this.onBoardChangeCallbacksID, callback);
    return this.onBoardChangeCallbacksID++;
  }
  unbindCallback(id: number) {
    if (this.onBoardChangeCallbacksMap.has(id)) {
      const cbs = this.onBoardChangeCallbacks;
      const cb = this.onBoardChangeCallbacksMap.get(id);
      cbs.splice(cbs.findIndex(fn => fn == cb), 1);
      this.onBoardChangeCallbacksMap.delete(id);
    }
  }

  async createBoard(boardInfo: any) {
    let prjID = this.prjService.currentPrj?._id;
    if (!prjID) return null;
    let board = await this.api.makeApiCall("post", `prj/${prjID}/board`, {body: boardInfo});
    board = this.initBoard(board);
    this.prjService.currentPrj?.boards?.push(board);
    this.initBoards(this.prjService.currentPrj?.boards);
    this.targetOnBoardChange(this.prjService.currentPrj?.boards);
    return board;
  }
  async delectBoard(boardInfo: any) {
    let prjID = this.prjService.currentPrj?._id;
    if (!prjID) return;
    await this.api.makeApiCall("delete", `prj/${prjID}/board/${boardInfo._id}`);
    const boards = this.prjService.currentPrj?.boards;
    boards?.splice(boards.findIndex(board => board._id == boardInfo._id), 1);
    this.initBoards(boards);
    this.targetOnBoardChange(boards);
  }
  async modifyBoard(boardInfo: any) {
    let prjID = this.prjService.currentPrj?._id;
    if (!prjID) return null;
    let board = await this.api.makeApiCall("put", `prj/${prjID}/board/${boardInfo._id}`, {body: boardInfo});
    board = this.initBoard(board);
    const boards = this.prjService.currentPrj?.boards;
    boards?.splice(boards.findIndex(board => board._id == boardInfo._id), 1);
    boards?.push(board);
    this.initBoards(boards);
    this.targetOnBoardChange(boards);
    return board;
  }
  async getBoardById(boardId: any) {
    let prjID = this.prjService.currentPrj?._id;
    if (!prjID) return null;
    let board = this.prjService.currentPrj?.boards?.find(b => boardId == b._id)
    if (board) return board;
    board = await this.api.makeApiCall("get", `prj/${prjID}/board/${boardId}`);
    board = this.initBoard(board);
    // const boards = this.prjService.currentPrj?.boards;
    // boards?.splice(boards.findIndex(board => board._id == boardInfo._id), 1);
    // boards?.push(board);
    // this.initBoards(boards);
    // this.targetOnBoardChange(boards);
    return board;
  }
}
