import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from "@angular/material/stepper";
import { MatSnackBar } from '@angular/material/snack-bar';

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
  ) { }

  ngOnInit(): void {
  }
  onReset() {
    this.stepper.reset();
  }

}
