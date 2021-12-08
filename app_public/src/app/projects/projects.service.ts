import { Injectable } from '@angular/core';
import { Project, User, Board, BoardCategory } from '../Types';
import { UserService } from '../user/user.service';
import { LoadingScreenService } from '../loading-screen/loading-screen.service';
// import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../api.service';

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
    // private translate: TranslateService,
    private api: ApiService,
  ) {
    this.initPrj = this.initPrj.bind(this);
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
  private onProjectChangeCallbacksID = 0;
  onProjectChange(callback: Function) {
    // console.trace(callback);
    this.onProjectChangeCallbacks.push(callback);
    return this.onProjectChangeCallbacksID++;
  }

  private async initPrj(prj: any) {
    prj.members = await Promise.all(
      (prj.members || []).map((uid: string) => this.usrService.getUserByID(uid)));
    return prj;
  }

  private rt(value: any) {
    this.loadingScreen.stopLoading();
    return value;
  }

  async getAllProjectsByCurrentUser() {
    this.loadingScreen.startLoading();
    const uinfo = this.usrService.getCurrentUser();
    if (!uinfo) {
      console.error("connot get user info");
      return this.rt(null);
    }
    if (uinfo._id === this.currentUsr?._id) return this.rt(this.currentPrjs);
    const prjs = await this.api.makeApiCall("get", "prjs?usrID=" + uinfo._id);
    await Promise.all(prjs.map(this.initPrj));
    uinfo.projects = prjs;
    this.currentUsr = uinfo;
    return this.rt(this.currentPrjs);
  }

  async getProjectById(projectId: string) {
    if (!projectId) return null;
    if (projectId == this.currentPrj?._id) return this.currentPrj;
    if (!this.currentPrjs) await this.getAllProjectsByCurrentUser();
    return this.currentPrj = this.currentPrjs?.filter(prj => prj._id === projectId)[0] || null;
  }

  async getAllBoardByCurrentPrj(): Promise<Board[] | null | undefined> {
    if (!this.currentPrj) {
      console.warn("need set currentPrj or call getProjectById before call getAllBoardByCurrentPrj");
      return null;
    }
    this.loadingScreen.startLoading();
    if (!this.currentPrjs) await this.getAllProjectsByCurrentUser();
    if (this.currentPrj.boards) return this.rt(this.currentPrj.boards);
    return this.rt(null);
  }

  async insertProject(project: any) {
    const uinfo = this.usrService.getCurrentUser();
    if (!uinfo) return "Please operate after logging in.";
    // Verify that all members exist.
    let userInfos = project.members.split(/, */g).map((s: string) => s.trim()).filter((s: string) => s);
    let users = await Promise.all(userInfos.map((noe: string) =>
      this.usrService.getUserByNameOrEmail({ name: noe, email: noe, })
    ));
    let notFind = users.filter(usr => usr == null);
    if (notFind.length)
      return "Connot find user by username or email: " + notFind.join(", ");
    if (!users.find((u: any) => u._id == uinfo._id))
      users.unshift(uinfo);

    // format cycle time
    const [cycd, cych] = project.cycle.split(":").map((s: string) => Number(s) || 0),
          cycle = ((cycd || 0) * 24 + (cych || 0)) * 60 * 60;
    const prj = await this.createProject({
      name: project.name,
      cycle,
      firstSprintStartAt: project.firstSprintStartAt.toISOString(),
      description: project.description,
      members: users.map((u: any) => u._id),
      boards: [{
        name: `{"default": "en", "en": "Product Backlog", "zh_cn": "产品代办列表"}`,
        description: `{"default": "en", "en": "The Product Backlog is an ordered list of everything that is known to be needed in the product. It is the single source of requirements for any changes to be made to the product. The Product Owner is responsible for the Product Backlog, including its content, availability, and ordering.", "zh_cn": "产品待办列表是一份涵盖产品中已知所需每项内容的有序列表，它是产品需求变动的唯一来源。产品负责人负责管理产品待办列表的内容、可用性和排序。"}`,
        category: BoardCategory.PRODUCT,
      }, {
        name: `{"default": "en", "en": "Sprint Backlog", "zh_cn": "Sprint代办列表"}`,
        cycle,
        description: `{"default": "en", "en": "The Sprint Backlog is the set of Product Backlog items selected for the Sprint, plus a plan for delivering the product Increment and realizing the Sprint Goal. The Sprint Backlog is a forecast by the Development Team about what functionality will be in the next Increment and the work needed to deliver that functionality into a “Done” Increment.", "zh_cn": "Sprint 待办列表是一组为当前 Sprint 选出的产品待办列表项，同时加上交付产品增量和实现 Sprint 目标的计划。Sprint 待办列表是开发团队对于下一个产品增量所需的那些功能以及交付那些功能到“完成”的增量中所需工作的预测。"}`,
        category: BoardCategory.SPRINT,
        cards: [
          { title: "Process", },
          { title: "Test", },
          { title: "Done", },
        ],
      }, ],
    });
    return "";
  }

  async createProject(prjInfo: any) {
    let prj = await this.api.makeApiCall("post", "prj", { body: prjInfo });
    prj = await this.initPrj(prj);
    this.currentUsr?.projects?.push(prj);
    return prj;
  }

  async deleteProject(prjInfo: any) {
    const prjs = this.currentUsr?.projects;
    if (!prjs) return;
    await this.api.makeApiCall("delete", "prj/" + prjInfo._id);
    prjs.splice(prjs.findIndex(prj => prj._id == prjInfo._id), 1);
  }

  async modifyProject(prjInfo: any) {
    const uinfo = this.usrService.getCurrentUser();
    if (!uinfo) return "Please operate after logging in.";
    // Verify that all members exist.
    let userInfos = prjInfo.members.split(/, */g).map((s: string) => s.trim()).filter((s: string) => s);
    let users = await Promise.all(userInfos.map((noe: string) =>
      this.usrService.getUserByNameOrEmail({ name: noe, email: noe, })
    ));
    let notFind = users.filter(usr => usr == null);
    if (notFind.length)
      return "Connot find user by username or email: " + notFind.join(", ");
    if (!users.find((u: any) => u._id == uinfo._id))
      users.unshift(uinfo);

    const [cycd, cych] = prjInfo.cycle.split(":").map((s: string) => Number(s) || 0),
          cycle = ((cycd || 0) * 24 + (cych || 0)) * 60 * 60;
    let prj = await this.api.makeApiCall("put", "prj/" + prjInfo._id, {body: {
      name: prjInfo.name,
      members: users.map((u: any) => u._id),
      cycle,
      firstSprintStartAt: prjInfo.firstSprintStartAt,
      description: prjInfo.description,
    }});
    const prjs = this.currentUsr?.projects;
    if (!prjs) return;
    prjs.splice(prjs.findIndex(prj => prj._id == prjInfo._id), 1);
    prj = await this.initPrj(prj);
    prjs.push(prj);
    prjs.sort((p1: any, p2: any) => p1.createdAt - p2.createdAt);
    // console.log(prjs)
    return "";
  }
}
