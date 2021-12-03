import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { UserStoryService } from "../user-story.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-or-edit-card',
  templateUrl: './create-or-edit-card.component.html',
  styleUrls: ['./create-or-edit-card.component.css']
})
export class CreateOrEditCardComponent implements OnInit {

  snackBarRef: any;

  get isModify() {
    return this.usService.currentCardFrom.controls["id"].value;
  }

  constructor(
    private snackBar: MatSnackBar,
    public usService: UserStoryService,
    public dialogRef: MatDialogRef<CreateOrEditCardComponent>,
    public translate: TranslateService,
  ) {
    translate.setTranslation("en", {
      "create_or_edit_card": {
        "title": {
          "modify": "Modify User Story",
          "create": "New User Story",
        },
        "card_title": "Title",
        "card_subtitle": "Subtitle",
        "content": "Content",
        "estimated_time_2_spend": "Estimated time to spend",
        "estimated_time_2_spend_placeholder": "hour(s) : minute(s)",
        "submit_btn": {
          "confirm": "Confirm",
          "create": "Create",
        }
      }
    }, true);
    translate.setTranslation("zh_cn", {
      "create_or_edit_card": {
        "title": {
          "modify": "修改用户故事",
          "create": "新建用户故事",
        },
        "card_title": "标题",
        "card_subtitle": "子标题",
        "content": "内容",
        "estimated_time_2_spend": "预计花费时间",
        "estimated_time_2_spend_placeholder": "小时 : 分钟",
        "submit_btn": {
          "confirm": "确认",
          "create": "创建",
        }
      }
    }, true);
  }

  ngOnInit(): void { }

  async onCreateOrModify() {
    let err = await this.usService.createOrModifyCard();
    if (!err) {
      this.usService.initializeFormGroup();
      this.onClose();
    }
    else
      this.snackBarRef = this.snackBar.open(err, "OK");
  }

  onClose() {
    this.snackBarRef?.closeWithAction();
    this.dialogRef.close();
  }

}
