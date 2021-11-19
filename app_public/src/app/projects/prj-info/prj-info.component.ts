import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    public translate: TranslateService,
  ) {
    translate.setTranslation("en", {
      "project_info": {
        "breadcrumb_nav": "Information",
        "title": "Project Information",
        "project_id": "Project ID:",
        "name": "Name:",
        "created_at": "Created at:",
        "first_sprint_start_at": "First Sprint start at:",
        "sprint_cycle_length": "Sprint cycle length:",
        "description": "Description:",
        "members": "Members:",
      }
    }, true);
    translate.setTranslation("zh_cn", {
      "project_info": {
        "breadcrumb_nav": "详情",
        "title": "项目信息",
        "project_id": "项目ID：",
        "name": "项目名称：",
        "created_at": "创建于：",
        "first_sprint_start_at": "第一次Sprint开始于：",
        "sprint_cycle_length": "Sprint周期长度：",
        "description": "描述：",
        "members": "成员：",
      }
    }, true);
  }

  ngOnInit(): void {
  }

}
