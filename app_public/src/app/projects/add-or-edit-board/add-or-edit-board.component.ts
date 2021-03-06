import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from "@angular/material/stepper";
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BoardsService } from './boards.service';
import { BoardCategory } from 'src/app/Types';

@Component({
  selector: 'app-add-or-edit-board',
  templateUrl: './add-or-edit-board.component.html',
  styleUrls: ['./add-or-edit-board.component.css']
})
export class AddOrEditBoardComponent implements OnInit {

  @ViewChild("stepper") private stepper!: MatStepper;
  filteredOptions: Observable<string[]>[] = [];
  get formArrayLangs(): FormArray { return <FormArray>this.secondFormGroup.controls["langs"]; }
  firstFormGroup = this.formBuilder.group({
    category: ['', Validators.required],
  });
  secondFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    lang: [this.translate.currentLang || this.translate.defaultLang, Validators.required],
    langs: this.formBuilder.array([]),
  });

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private boradService: BoardsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddOrEditBoardComponent>,
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
        "archive_board_text": "OR, you want to archive this Sprint board?",
        "archive_btn": "archive",
        "delete_board_text": "OR, you want to delete this board?",
        "delete_btn": "DELETE",
        "fill_board_info": "Fill board information",
        "back_btn": "Back",
        "board_title": "Board Title",
        "board_description": "Board description",
        "add_new_language_btn": "Add new language",
        "language_used_above": "??? Language used above",
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
          "modify": "??????????????????",
          "new": "????????????",
        },
        "select_board_type": "????????????????????????",
        "next_btn": "?????????",
        "board_type_text": "???????????????",
        "board_type": {
          "product": "??????????????????",
          "sprint": "Sprint????????????",
        },
        "cannot_modified": "???????????????????????????????????????",
        "archive_board_text": "???????????????????????????Sprint?????????",
        "archive_btn": "??????",
        "delete_board_text": "?????????????????????????????????",
        "delete_btn": "??????",
        "fill_board_info": "??????????????????",
        "back_btn": "?????????",
        "board_title": "????????????",
        "board_description": "????????????",
        "add_new_language_btn": "????????????",
        "language_used_above": "????????????????????????",
        "language": "??????",
        "done": "??????",
        "reset_btn": "??????",
        "done_btn": {
          "modify": "??????",
          "create": "??????",
        },
        "done_text": "?????????",
      }
    }, true);
  }

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
        value = value || "";
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
    this.secondFormGroup.patchValue({
      name: board?.name || '',
      description: board?.description || '',
      lang: board?.langs?.name.default || this.translate.currentLang || this.translate.defaultLang,
    });
    this.secondFormGroup.setControl("langs", this.formBuilder.array(board?.langs
      ? Object.keys(board.langs.name)
        .filter(lang => lang != "default" && lang != board.langs.name.default).map(lang =>
          this.formBuilder.group({
            lang: [lang, Validators.required],
            name: [board.langs.name[lang], Validators.required],
            description: [board.langs.description[lang]],
          }))
      : []));
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
    this.onReset();
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
    let board = await (this.data.board?._id
      ? this.boradService.modifyBoard({
        _id: this.data.board?._id,
        name, description, category,
      })
      : this.boradService.createBoard({
        name, description, category,
        projectId: this.data.project._id,
        cards: category == BoardCategory.PRODUCT? []
          : [
            { title: "Process", },
            { title: "Test", },
            { title: "Done", },
          ]
      }));
    this.onClose(board);
  }

  snackBarRef: any;
  async onDelete() {
    const num = this.data.project.boards.filter((board: any) => board.category === this.data.board.category).length;
    if (num <= 1) {
      this.snackBarRef = this.snackBar.open(`Delete Error: Every project must have a ${this.data.board.category} board.`, "OK");
    }
    else {
      await this.boradService.delectBoard(this.data.board);
      this.onClose({delete: true});
    }
  }

  async onArchive() {
    const num = this.data.project.boards.filter((board: any) => board.category === this.data.board.category).length;
    if (num <= 1) {
      this.snackBarRef = this.snackBar.open(`Delete Error: Every project must have a ${this.data.board.category} board.`, "OK");
    }
    else {
      const board = await this.boradService.modifyBoard({
        _id: this.data.board._id,
        name: this.data.board.name,
        category: BoardCategory.ARCHIVE,
      });
      this.onClose(board);
    }
  }
}
