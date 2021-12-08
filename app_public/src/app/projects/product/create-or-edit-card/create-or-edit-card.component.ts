import { Component, Inject, OnInit } from '@angular/core';
// import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserStoryService } from "../user-story.service";
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-or-edit-card',
  templateUrl: './create-or-edit-card.component.html',
  styleUrls: ['./create-or-edit-card.component.css']
})
export class CreateOrEditCardComponent implements OnInit {

  snackBarRef: any;
  currentCardFrom = this.formBuilder.group({
    _id: [null],
    boardId: [null],
    title: ["", Validators.required],
    subTitle: [""],
    content: [""],
    totalTime: [""],
  });

  get isModify() { return !!this.currentCardFrom.controls["_id"].value; }
  get currentCard() { return this.data; }
  get isEdited() {
    const oldCard = this.currentCard, nowCard = this.currentCardFrom.value;
    const [th, tm] = nowCard.totalTime.split(":").map((s: any) => Number(s) || 0),
          totalTime = ((th || 0) * 60 + (tm || 0)) * 60;
    if (oldCard.totalTime && oldCard.totalTime != totalTime) return true;
    return "title,subTitle,content"
      .split(",").some(p => oldCard[p] != nowCard[p]);
  }

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public usService: UserStoryService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateOrEditCardComponent>,
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

  ngOnInit(): void {
    this.populateForm();
  }

  populateForm(card: any = this.currentCard) {
    this.currentCardFrom.reset();
    let totalTime = card.totalTime || 0,
        th = Math.floor(totalTime / 60 / 60),
        tm = Math.floor(totalTime / 60) - th * 60;
    this.currentCardFrom.setValue({
      _id: card._id || null,
      boardId: card.boardId || null,
      title: card.title || "",
      subTitle: card.subTitle || "",
      content: card.content || "",
      totalTime: (totalTime? th + " : " + tm: ""),
    });
  }

  async onCreateOrModify() {
    if (!this.isEdited) this.onClose();
    const card = this.currentCardFrom.value;
    let err = await (this.isModify? this.usService.modifyCard(card): this.usService.insertCard(card));
    // console.log(err);
    if (typeof err !== "string") this.onClose();
    else
      this.snackBarRef = this.snackBar.open(err, "OK");
  }

  onClose() {
    this.populateForm({});
    this.snackBarRef?.closeWithAction();
    this.dialogRef.close();
  }

}
