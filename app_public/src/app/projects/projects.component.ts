import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  @ViewChild("sideNav")
  public sideNav!: MatDrawer;

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

}
