import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateOrModifyProjectsService } from "../../create-or-modify-projects.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-project-create-or-modify',
  templateUrl: './project-create-or-modify.component.html',
  styleUrls: ['./project-create-or-modify.component.css']
})
export class ProjectCreateOrModifyComponent implements OnInit {

  startDate = new Date();
  snackBarRef: any;

  get isModify() {
    return this.comService.projectForm.controls["id"].value;
  }

  constructor(
    private snackBar: MatSnackBar,
    public comService: CreateOrModifyProjectsService,
    public dialogRef: MatDialogRef<ProjectCreateOrModifyComponent>,
    public translate: TranslateService,
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
        "members_placeholder": "member1 email, member2 email, ... (You will be included, whether you enter.)",
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
        "members_placeholder": "成员1邮箱, 成员2邮箱, ... （无论是否输入，都会将您包括在内。）",
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
  }

  async onCreateOrModify() {
    let ans: any = await this.comService.createOrModifyProject();
    if (!ans) {
      this.comService.initializeFormGroup();
      this.onClose();
    }
    else
      this.snackBarRef = this.snackBar.open(ans, "OK");
  }

  onClose() {
    this.snackBarRef?.closeWithAction();
    this.dialogRef.close();
  }

}
