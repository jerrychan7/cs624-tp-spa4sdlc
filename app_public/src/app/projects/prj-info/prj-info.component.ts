import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prj-info',
  templateUrl: './prj-info.component.html',
  styleUrls: ['./prj-info.component.css']
})
export class PrjInfoComponent implements OnInit {

  project: any = {
    name: "name",
    createdAtString: "createdAtString",
    firstSprintStartAtString: "firstSprintStartAtString",
    cycleString: "cycleString",
    description: "description",
    members: [],
  };

  get nowPrjID() {
    // return this.route.parent.snapshot.paramMap.get('prjID');
    return "prj id";
  }

  constructor() { }

  ngOnInit(): void {
  }

}
