import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Project } from '../Types';


@Injectable({
  providedIn: 'root'
})
export class CreateOrModifyProjectsService {

  projectForm = new FormGroup({
    id: new FormControl(null),
    name: new FormControl("", Validators.required),
    members: new FormControl(""),
    cycle: new FormControl("", Validators.required),
    firstSprintStartAt: new FormControl("", Validators.required),
    description: new FormControl(""),
  });

  currentPrj: Project | null = null;

  constructor() { }

  setCurrentProject(prj: Project | null = null) {
    this.currentPrj = prj;
    if (prj === null)
      this.initializeFormGroup();
    else {
      const cycd = Math.floor(prj.cycle / 60 / 60 / 24),
            cych = Math.floor(prj.cycle / 60 / 60) - cycd * 24;
      this.populateForm({
        id: prj.id,
        name: prj.name,
        description: prj.description,
        firstSprintStartAt: prj.firstSprintStartAt,
        cycle: cycd + " : " + cych,
        membersEmail: prj.members?.map(ms => ms.email),
      });
    }
  }

  initializeFormGroup() {
    this.populateForm();
  }

  populateForm(project:any = {}) {
    this.projectForm.reset();
    this.projectForm.setValue({
      id: project.id || null,
      name: project.name || "",
      description: project.description || "",
      firstSprintStartAt: project.firstSprintStartAt || "",
      cycle: project.cycle || "",
      members: project.membersEmail?.join(", ") || "",
    });
  }

  createOrModifyProject(project = this.projectForm.value) {
    if (this.projectForm.controls["id"].value)
      return this.modifyProject(project);
    return this.insertProject(project);
  }
  
  async insertProject(project = this.projectForm.value) {
    // let emails = project.members.split(",").map(e => e.trim()).filter(e => e),
    //     membersId = emails.length
    //     ? (await Promise.all(
    //       emails.map(m => this.api.GetUserByEmail(m.trim())) as GetUserByEmailQuery[]
    //     )).map(m => m.items[0]?.cognitoId): [];
    // let notFind = emails.filter((e, i) => !membersId[i]);
    // if (notFind.length)
    //   return "Connot find user by email: " + notFind.join(", ");
    // let uinfo = await Auth.currentUserInfo();
    // if (!emails.includes(uinfo.attributes.email))
    //   membersId.unshift(uinfo.attributes.sub);
    
    // const [cycd, cych] = project.cycle.split(":").map(s => Number(s) || 0),
    //       cycle = ((cycd || 0) * 24 + (cych || 0)) * 60 * 60;
    // const prj = await this.api.CreateProject({
    //   name: project.name,
    //   firstSprintStartAt: project.firstSprintStartAt.toISOString(),
    //   cycle,
    //   description: project.description
    // });

    // const [sprBoard] = await Promise.all([
    //   this.api.CreateBoard({
    //     projectId: prj.id,
    //     // name: "Sprint Backlog",
    //     name: `{"default": "en", "en": "Sprint Backlog", "zh_cn": "Sprint代办列表"}`,
    //     cycle,
    //     // description: "The Sprint Backlog is the set of Product Backlog items selected for the Sprint, plus a plan for delivering the product Increment and realizing the Sprint Goal. The Sprint Backlog is a forecast by the Development Team about what functionality will be in the next Increment and the work needed to deliver that functionality into a “Done” Increment.",
    //     description: `{"default": "en", "en": "The Sprint Backlog is the set of Product Backlog items selected for the Sprint, plus a plan for delivering the product Increment and realizing the Sprint Goal. The Sprint Backlog is a forecast by the Development Team about what functionality will be in the next Increment and the work needed to deliver that functionality into a “Done” Increment.", "zh_cn": "Sprint 待办列表是一组为当前 Sprint 选出的产品待办列表项，同时加上交付产品增量和实现 Sprint 目标的计划。Sprint 待办列表是开发团队对于下一个产品增量所需的那些功能以及交付那些功能到“完成”的增量中所需工作的预测。"}`,
    //     category: BoardCategory.Sprint
    //   }),
    //   this.api.CreateBoard({
    //     projectId: prj.id,
    //     // name: "Product Backlog",
    //     // description: "The Product Backlog is an ordered list of everything that is known to be needed in the product. It is the single source of requirements for any changes to be made to the product. The Product Owner is responsible for the Product Backlog, including its content, availability, and ordering.",
    //     name: `{"default": "en", "en": "Product Backlog", "zh_cn": "产品代办列表"}`,
    //     description: `{"default": "en", "en": "The Product Backlog is an ordered list of everything that is known to be needed in the product. It is the single source of requirements for any changes to be made to the product. The Product Owner is responsible for the Product Backlog, including its content, availability, and ordering.", "zh_cn": "产品待办列表是一份涵盖产品中已知所需每项内容的有序列表，它是产品需求变动的唯一来源。产品负责人负责管理产品待办列表的内容、可用性和排序。"}`,
    //     category: BoardCategory.Product
    //   }),
    //   ...membersId.map(mid => this.api.CreateProejctMembers({
    //     userId: mid,
    //     projectId: prj.id
    //   })) as Array<Promise<any>>,
    // ]);

    // await this.api.CreateCard({
    //   title: "Process",
    //   boardId: sprBoard.id,
    // });
    // await this.api.CreateCard({
    //   title: "Test",
    //   boardId: sprBoard.id,
    // });
    // await this.api.CreateCard({
    //   title: "Done",
    //   boardId: sprBoard.id,
    // });

    // return "";
  }

  async modifyProject(project = this.projectForm.value) {
    // let emails = project.members.split(",").map(e => e.trim()).filter(e => e),
    //     oldEmails = this.currentPrj.members.items.map(ms => ms?.member?.email);
    // if (emails.join(",") !== oldEmails.join(",")) {
    //   let membersId = emails.length
    //     ? (await Promise.all(
    //       emails.map(m => this.api.GetUserByEmail(m.trim())) as GetUserByEmailQuery[]
    //     )).map(m => m.items[0]?.cognitoId): [];
    //   let notFind = emails.filter((e, i) => !membersId[i]);
    //   if (notFind.length)
    //     return "Connot find user by email: " + notFind.join(", ");
    //   let uinfo = await Auth.currentUserInfo();
    //   if (!emails.includes(uinfo.attributes.email))
    //     membersId.unshift(uinfo.attributes.sub);
    //   await Promise.all([
    //     ...oldEmails.map((oe, i) => (emails.includes(oe))
    //       ? false
    //       : this.api.DeleteProejctMembers({
    //           id: this.currentPrj.members.items[i].id
    //         })
    //     ).filter(oe => oe),
    //     ...emails.map((e, i) => (oldEmails.includes(e))
    //       ? false
    //       : this.api.CreateProejctMembers({
    //           userId: membersId[i],
    //           projectId: this.currentPrj.id
    //         })
    //     ).filter(e => e)
    //   ]);
    // }
    // const [cycd, cych] = project.cycle.split(":").map(s => Number(s) || 0),
    //       cycle = ((cycd || 0) * 24 + (cych || 0)) * 60 * 60;
    // if (project.name !== this.currentPrj.name
    // || project.description !== this.currentPrj.description
    // || cycle !== this.currentPrj.cycle) {
    //   await this.api.UpdateProject({
    //     id: this.currentPrj.id,
    //     name: project.name,
    //     cycle,
    //     description: project.description,
    //   });
    //   console.log(this)
    // }
    // return "";
  }

  async removeProject(prj: Project) {
    // await Promise.all([
    //   // ...prj.members.items.map(ms => this.api.DeleteProejctMembers({id: ms.id}).catch(e => {})),
    //   this.api.DeleteProejctMembers({}, {projectId: {eq: prj.id}}),
    //   ...(await GetBoardsByProjectId(prj.id)).items.reduce((arr, board) => {
    //     arr.push(
    //       // ...board.cards.items.map(card => this.api.DeleteCard({id: card.id}).catch(e => {})),
    //       this.api.DeleteCard({}, {boardId: {eq: board.id}}),
    //       this.api.DeleteBoard({id: board.id}).catch(e => {})
    //     );
    //     return arr;
    //   }, []),
    //   this.api.DeleteProject({id: prj.id}),
    // ]);
  }

}
