import { Injectable } from '@angular/core';
import { Project, User, Board } from '../Types';
import { PROJECTS } from './mock.prjs';
import { UserService } from '../user/user.service';
import { LoadingScreenService } from '../loading-screen/loading-screen.service';
import { TranslateService } from '@ngx-translate/core';

function getDateFromMilliseconds(ms: number | undefined | null): Date {
  let d = new Date(0);
  d.setMilliseconds(ms || 0);
  return d;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private usrService: UserService,
    private loadingScreen: LoadingScreenService,
    private translate: TranslateService,
  ) {
    this.initBoard = this.initBoard.bind(this);
  }

  public currentPrjs: Project[] | null = null;
  private _currentPrj: Project | null = null;
  get currentPrj() { return this._currentPrj; }
  set currentPrj(prj) {
    this._currentPrj = prj;
    (async (cbs) => {
      for (let cb of cbs)
        await cb(prj);
    })(this.onProjectChangeCallbacks);
  }
  private _currentUsr: User | null = null;
  get currentUsr(): User | null { return this._currentUsr; }
  set currentUsr(cu: User | null) {
    if (!cu) return;
    this._currentUsr = cu;
    this.currentPrjs = cu.projects || [];
  }
  private onProjectChangeCallbacks: Function[] = [];
  onProjectChange(callback: Function) {
    this.onProjectChangeCallbacks.push(callback);
  }

  private initBoard(board: Board & {
    createdTime: Date,
    updatedTime: Date,
    langs: Object,
  } | any) {
    board.createdTime = getDateFromMilliseconds(board.createdAt);
    board.updatedTime = getDateFromMilliseconds(board.updatedAt);
    board.cards?.forEach((card: any) => {
      card.createdTime = getDateFromMilliseconds(card.createdAt);
      card.updatedTime = getDateFromMilliseconds(card.updatedAt);
    });
    try {
      const name = JSON.parse(board.name),
            description = JSON.parse(board.description || "{}");
      Object.entries(name).forEach(([lang, tran]) => {
        if (lang === "default") return;
        this.translate.setTranslation(lang, {
          [board.category === "Sprint"? "sprint_board": "product_board"]: {
            [board.id]: {
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
        [board.category === "Sprint"? "sprint_board": "product_board"]: {
          [board.id]: {
            name: board.name,
            description: board.description,
          }
        },
      }, true);
    }
    return board;
  }

  private async getAllProjects(): Promise<Project[]> {
    // Simulate network delay.
    await new Promise(s => setTimeout(s, 500));
    return PROJECTS;
  }
  async getAllProjectsByCurrentUser() {
    this.loadingScreen.startLoading();
    // Simulate network delay.
    await new Promise(s => setTimeout(s, 500));
    const uinfo = await this.usrService.asyncCurrentUserInfo();
    if (uinfo === null) {
      console.error("connot get user info");
      this.loadingScreen.stopLoading();
      return null;
    }
    if (uinfo.id === this.currentUsr?.id) return this.currentPrjs;
    this.currentUsr = uinfo;
    this.loadingScreen.stopLoading();
    return this.currentPrjs;
  }

  async getProjectById(projectId: string) {
    if (!this.currentPrjs) await this.getAllProjectsByCurrentUser();
    return this.currentPrj = this.currentPrjs?.filter(prj => prj.id === projectId)[0] || null;
  }

  private async getBoardsByProjectId(prjID: string) {
    return this.currentPrj?.boards;
  }
  async getAllBoardByCurrentPrj() {
    if (!this.currentPrj) {
      console.warn("need set currentPrj or call getProjectById before call getAllBoardByCurrentPrj");
      return null;
    }
    this.loadingScreen.startLoading();
    if (!this.currentPrjs) await this.getAllProjectsByCurrentUser();
    if (this.currentPrj.boards) {
      this.loadingScreen.stopLoading();
      return this.currentPrj.boards;
    }
    const boards = await this.getBoardsByProjectId(this.currentPrj.id);
    boards?.forEach(this.initBoard);
    this.loadingScreen.stopLoading();
    return this.currentPrj.boards = boards;
  }
}
