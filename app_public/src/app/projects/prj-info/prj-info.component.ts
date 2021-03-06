import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Project } from 'src/app/Types';
import { ProjectsService } from "../projects.service";

@Component({
  selector: 'app-prj-info',
  templateUrl: './prj-info.component.html',
  styleUrls: ['./prj-info.component.css']
})
export class PrjInfoComponent implements OnInit {

  project: Project | any = null;

  get nowPrjID() {
    return this.route.parent?.snapshot.paramMap.get('prjID');
  }

  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private prjsService: ProjectsService,
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

  async ngOnInit() {
    this.project = await this.prjsService.getProjectById(this.nowPrjID || "");
    if (!this.project) return;
    const cycd = Math.floor(this.project.cycle / 60 / 60 / 24),
          cych = Math.floor(this.project.cycle / 60 / 60) - cycd * 24;
    this.project.cycleString = (cycd? cycd + " day" + (cycd > 1? "s": ""): "") + (cych? cych + " hour" + (cych > 1? "s": ""): "");
    this.project.firstSprintStartAtString = (new Date(this.project.firstSprintStartAt)).toDateString();
    this.project.createdAtString = (new Date(this.project.createdAt)).toDateString();
  }

}
