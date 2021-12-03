import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from "@angular/material/stepper";
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-or-edit-board',
  templateUrl: './add-or-edit-board.component.html',
  styleUrls: ['./add-or-edit-board.component.css']
})
export class AddOrEditBoardComponent implements OnInit {

  @ViewChild("stepper")
  private stepper!: MatStepper;

  constructor(
    public dialogRef: MatDialogRef<AddOrEditBoardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
  ) {
    this.initAutoComleteGroup = this.initAutoComleteGroup.bind(this);
    translate.setTranslation("en", {
      "add_or_edit_board": {
        "title": {
          "modify": "Modify Board",
          "new": "New Board",
        },
        "select_board_type": "Select a board type",
        "next_btn": "Next",
        "board_type_text": "Board Type:",
        "board_type": {
          "product": "Product Backlog",
          "sprint": "Sprint Backlog",
        },
        "cannot_modified": "This field cannot be modified after creation.",
        "delete_board_text": "OR, you want to delete this board?",
        "delete_btn": "DELETE",
        "fill_board_info": "Fill board information",
        "back_btn": "Back",
        "board_title": "Board Title",
        "board_description": "Board description",
        "add_new_language_btn": "Add new language",
        "language_used_above": "↑ Language used above",
        "language": "Language",
        "done": "Done",
        "reset_btn": "Reset",
        "done_btn": {
          "modify": "Modify",
          "create": "Create",
        },
        "done_text": "You are now done.",
      }
    }, true);
    translate.setTranslation("zh_cn", {
      "add_or_edit_board": {
        "title": {
          "modify": "修改板块信息",
          "new": "新建板块",
        },
        "select_board_type": "选择一个板块类型",
        "next_btn": "下一步",
        "board_type_text": "板块类型：",
        "board_type": {
          "product": "产品待办列表",
          "sprint": "Sprint代办列表",
        },
        "cannot_modified": "创建板块后无法修改此字段。",
        "delete_board_text": "或者，您要删除此板块？",
        "delete_btn": "删除",
        "fill_board_info": "填写板块信息",
        "back_btn": "上一步",
        "board_title": "板块标题",
        "board_description": "板块描述",
        "add_new_language_btn": "添加翻译",
        "language_used_above": "↑上面所使用语言",
        "language": "语言",
        "done": "完成",
        "reset_btn": "重置",
        "done_btn": {
          "modify": "修改",
          "create": "创建",
        },
        "done_text": "完成！",
      }
    }, true);
  }

  firstFormGroup: FormGroup = this.formBuilder.group({
    category: ['', Validators.required],
  });
  secondFormGroup: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    lang: [this.translate.currentLang || this.translate.defaultLang, Validators.required],
    langs: this.formBuilder.array([]),
  });
  filteredOptions: Observable<string[]>[] = [];

  get formArrayLangs(): FormArray { return <FormArray>this.secondFormGroup.controls["langs"]; }

  ngOnInit(): void {
    this.initOrResetFormGroup();
    this.initAutoComleteGroup(this.secondFormGroup);
    (this.secondFormGroup.controls["langs"] as FormArray).controls.forEach(this.initAutoComleteGroup as any);
  }
  private initAutoComleteGroup(group: FormGroup): FormGroup {
    this.filteredOptions.push(group.controls["lang"].valueChanges.pipe(
      startWith(""),
      // autoCompleteFilter
      map((value: string): string[] => {
        const filterValue = value.toLowerCase();
        return this.translate.getLangs().filter(option => option.toLowerCase().includes(filterValue));
      }),
    ));
    return group;
  }

  private initOrResetFormGroup() {
    const board = this.data.board;
    this.firstFormGroup.setValue({
      category: board?.category || '',
    });
    this.secondFormGroup.setValue({
      name: board?.name || '',
      description: board?.description || '',
      lang: board?.langs?.name.default || this.translate.currentLang || this.translate.defaultLang,
      langs: this.formBuilder.array(board?.langs
        ? Object.keys(board.langs.name).filter(lang => lang != "default" && lang != board?.langs?.name.default).map(lang =>
            this.formBuilder.group({
              lang: [lang, Validators.required],
              name: [board.langs.name[lang], Validators.required],
              description: [board.langs.description[lang]],
            }))
        : []),
    });
  }

  onAddLang() {
    const langs = <FormArray>this.secondFormGroup.controls["langs"];
    langs.push(this.initAutoComleteGroup(this.formBuilder.group({
      lang: ["", Validators.required],
      name: ["", Validators.required],
      description: [""],
    })));
  }
  onDelLang(index: number) {
    const arrayControl = <FormArray>this.secondFormGroup.controls["langs"];
    arrayControl.removeAt(index);
    this.filteredOptions.splice(index + 1, 1);
  }

  onReset() {
    this.stepper.reset();
    this.initOrResetFormGroup();
  }
  onClose(data: any = undefined) {
    this.snackBarRef?.closeWithAction();
    this.dialogRef.close(data);
  }
  async onDone() {
    let {name, description, lang, langs} = this.secondFormGroup.value;
    description = langs.length
      ? JSON.stringify(langs.reduce((obj: any, l: any) => {
          obj[l.lang] = l.description;
          return obj;
        }, { [lang]: description, default: lang, }))
      : description;
    name = langs.length
      ? JSON.stringify(langs.reduce((obj: any, l: any) => {
          obj[l.lang] = l.name;
          return obj;
        }, { [lang]: name, default: lang, }))
      : name;
    const {category} = this.firstFormGroup.value;
    // const board = this.data.board?.id
    //   ? await this.api.UpdateBoard({
    //     id: this.data.board.id,
    //     name, description,
    //   })
    //   : await this.api.CreateBoard({
    //     name, description, category,
    //     projectId: this.data.project.id,
    //   });
    if (category == "Sprint") {
      // const boardId = board.id;
      // await this.api.CreateCard({boardId,  title: "Process", });
      // await this.api.CreateCard({boardId,  title: "Test", });
      // await this.api.CreateCard({boardId,  title: "Done", });
    }
    // console.log(board)
    // this.onClose(board);
  }

  snackBarRef: any;
  async onDelete() {
    const num = this.data.project.boards.items.filter((board: any) => board.category === this.data.board.category).length;
    if (num <= 1) {
      this.snackBarRef = this.snackBar.open(`Delete Error: Every project must have a ${this.data.board.category} board.`, "OK");
    }
    else {
      // await this.api.DeleteCard({}, {boardId: {eq: this.data.board.id}}).catch(e => {});
      // await this.api.DeleteBoard({ id: this.data.board.id });
      this.onClose({delete: true});
    }
  }
}
