import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-project-create-or-modify',
  templateUrl: './project-create-or-modify.component.html',
  styleUrls: ['./project-create-or-modify.component.css']
})
export class ProjectCreateOrModifyComponent implements OnInit {

  startDate = new Date();
  snackBarRef: any;
  projectForm = new FormGroup({
    _id: new FormControl(null),
    name: new FormControl("", Validators.required),
    members: new FormControl(""),
    cycle: new FormControl("", Validators.required),
    firstSprintStartAt: new FormControl("", Validators.required),
    description: new FormControl(""),
  });

  get isModify() { return this.projectForm.controls["_id"].value; }
  get currentPrj() { return this.data; }
  get isEdited() {
    if (!this.isModify) return true;
    const oldCard = this.currentPrj, nowCard = this.projectForm.value;
    const currentUsr = this.prjService.currentUsr;
    const nowEmails = nowCard.members.split(",")
      .map((s: string) => s.trim()).filter((s: string) => s && s != currentUsr?.email);
    const oldEmails = oldCard.members.map((u: any) => u.email.trim()).filter((s: string) => s && s != currentUsr?.email);
    if (oldEmails.length != nowEmails.length
      || nowEmails.length != (new Set([...nowEmails, ...oldEmails])).size)
        return true;
    let [cycd, cych] = nowCard.cycle.split(":").map((s: string) => Number(s) || 0),
        cycle = ((cycd || 0) * 24 + (cych || 0)) * 60 * 60;
    if (cycle != oldCard.cycle) return true;
    return "name,firstSprintStartAt,description"
      .split(",").some(p => oldCard[p] != nowCard[p]);
  }

  constructor(
    private snackBar: MatSnackBar,
    private prjService: ProjectsService,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProjectCreateOrModifyComponent>,
  ) {
    translate.setTranslation("en", {
      "create_or_modify_project": {
        "title": {
          "create": "New Project",
          "modify": "Modify Project",
        },
        "project_name": "Project Name",
        "field_mandatory": "This field is mandatory.",
        "members": "Members",
        "members_placeholder": "member1's email/username, member2's, ... (You will be included, whether you enter.)",
        "sprint_cycle_time": "Sprint cycle Time",
        "sprint_cycle_time_placeholder": "day(s) : hour(s)",
        "first_sprint_start_at": "First Sprint Start At:",
        "description": "description",
        "submit_btn": {
          "confirm": "Confirm",
          "create": "Create",
        },
      }
    }, true);
    translate.setTranslation("zh_cn", {
      "create_or_modify_project": {
        "title": {
          "create": "新建项目",
          "modify": "修改项目",
        },
        "project_name": "项目名称",
        "field_mandatory": "此字段是必填字段。",
        "members": "成员",
        "members_placeholder": "成员1邮箱/用户名, 成员2邮箱/用户名, ... （无论是否输入，都会将您包括在内。）",
        "sprint_cycle_time": "Sprint周期长度",
        "sprint_cycle_time_placeholder": "天 : 小时",
        "first_sprint_start_at": "首次Sprint始于：",
        "description": "描述",
        "submit_btn": {
          "confirm": "确认",
          "create": "创建",
        },
      }
    }, true);
  }

  ngOnInit(): void {
    this.populateForm();
  }

  populateForm(project: any = this.currentPrj) {
    this.projectForm.reset();
    let cycle = project.cycle || 0,
        cycd = Math.floor(cycle / 60 / 60 / 24),
        cych = Math.floor(cycle / 60 / 60) - cycd * 24,
        members = project.members?.map((u: any) => u.email);
    this.projectForm.setValue({
      _id: project._id || null,
      name: project.name || "",
      description: project.description || "",
      firstSprintStartAt: project.firstSprintStartAt || "",
      cycle: project.cycle? cycd + " : " + cych: "",
      members: members?.join(", ") || "",
    });
  }

  async onCreateOrModify() {
    if (!this.isEdited) this.onClose();
    const prj = this.projectForm.value;
    let err = await (this.isModify? this.prjService.modifyProject(prj): this.prjService.insertProject(prj));
    if (!err) this.onClose();
    else
      this.snackBarRef = this.snackBar.open(err, "OK");
  }

  onClose() {
    this.populateForm({});
    this.snackBarRef?.closeWithAction();
    this.dialogRef.close();
  }

}
