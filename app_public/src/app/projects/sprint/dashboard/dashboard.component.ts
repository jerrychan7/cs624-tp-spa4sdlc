import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from "../../projects.service";
import { map } from 'rxjs/operators';
// import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { UserService } from "../../../user/user.service";
import { TranslateService } from '@ngx-translate/core';
import { BoardCategory, Card } from 'src/app/Types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  getRouteParams(param: string) {
    let r: any = this.route;
    while (r) {
      let id = r.snapshot.paramMap.get(param);
      if (id) return id;
      r = r.parent;
    }
    return null;
  }
  get nowPrjID() { return this.getRouteParams("prjID"); }
  nowPrj: any;
  options: any;
  daysreports: any;

  // /** Based on the screen size, switch from standard to one column per row */
  // cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
  //   map(({ matches }) => {
  //     // if (matches) {
  //     //   return [
  //     //     { title: 'Burndown', cols: 1, rows: 1 },
  //     //     { title: 'Chart 1', cols: 1, rows: 1 },
  //     //     { title: 'Daily report', cols: 1, rows: 1 },
  //     //     { title: 'Chart 2', cols: 1, rows: 1 }
  //     //   ];
  //     // }

  //     // return [
  //     //   { title: 'Burndown', cols: 2, rows: 1, options: true },
  //     //   { title: 'Chart 1', cols: 1, rows: 1 },
  //     //   { title: 'Daily report', cols: 1, rows: 2 },
  //     //   { title: 'Chart 2', cols: 1, rows: 1 },
  //     // ];
  //     console.log(matches)
  //     return [
  //       // { title: "Burndown", cols: 2, rows: 1, options: true, },
  //       // { title: "Daily report", cols: 2, rows: 2, content: true, },
  //       { title: this.translate.instant("sprint_dashboard.burndown"), cols: 2, rows: 1, options: true, },
  //       { title: this.translate.instant("sprint_dashboard.daily_report"), cols: 2, rows: 2, content: true, },
  //     ];
  //   })
  // );
  cards = [
    { title: this.translate.instant("sprint_dashboard.burndown"), cols: 2, rows: 1, options: true, },
    { title: this.translate.instant("sprint_dashboard.daily_report"), cols: 2, rows: 2, content: true, },
  ];

  constructor(
    private route: ActivatedRoute,
    // private breakpointObserver: BreakpointObserver,
    public prjsService: ProjectsService,
    private usrService: UserService,
    public translate: TranslateService,
  ) {
    translate.setTranslation("en", {
      "sprint_dashboard": {
        "breadcrumb_nav": {
          "sprint_backlog": "Sprint Backlog",
          "dashboard": "Dashboard",
        },
        "sprint_dashboard_title": "Sprint Dashboard",
        "burndown": "Burndown",
        "daily_report": "Daily Report",
        "burndown_helper": `
          The Sprint Burndown is a technique to display publicly the remaining work of the current Sprint.
          On the vertical axis, it shows the work remaining in a Sprint.
          On the horizontal axis, it shows the workdays of a Sprint.
          In the Daily Scrum, the Development Team updates the Sprint Burndown and plots the remaining work of the day.
          By drawing a line through the points on the graph, the Development Team can monitor their progress in completing a Sprint’s work.`,
        "daily_report_helper": `<p>
            The Daily Scrum is a 15-minute time-boxed event for the Development Team. The Daily Scrum is
            held every day of the Sprint. At it, the Development Team plans work for the next 24 hours. This
            optimizes team collaboration and performance by inspecting the work since the last Daily Scrum
            and forecasting upcoming Sprint work. The Daily Scrum is held at the same time and place each
            day to reduce complexity.
          </p><p>
            The Development Team uses the Daily Scrum to inspect progress toward the Sprint Goal and to
            inspect how progress is trending toward completing the work in the Sprint Backlog. The Daily
            Scrum optimizes the probability that the Development Team will meet the Sprint Goal. Every
            day, the Development Team should understand how it intends to work together as a self-organizing
            team to accomplish the Sprint Goal and create the anticipated Increment by the end
            of the Sprint.
          </p>`,
      }
    }, true);
    translate.setTranslation("zh_cn", {
      "sprint_dashboard": {
        "breadcrumb_nav": {
          "sprint_backlog": "Sprint待办列表",
          "dashboard": "仪表盘",
        },
        "sprint_dashboard_title": "Sprint仪表盘",
        "burndown": "燃尽图",
        "daily_report": "每日报告",
        "burndown_helper": `
          Sprint燃尽图是一种公开显示当前Sprint剩余工作的技术。
          在垂直轴上，它显示了Sprint中剩余的工作。
          在水平轴上，它显示了Sprint的工作日。
          在每日 Scrum 站会中，开发团队将更新Sprint燃尽图，并绘制当天剩余的工作。
          通过在图中的点上画一条线，开发团队可以监视他们完成Sprint工作的进度。`,
        "daily_report_helper": `<p>
            每日 Scrum 站会是针对开发团队的15分钟定时活动。
            在Sprint周期中的每一天都举行每日 Scrum 站会。
            开发团队将在此计划下一个24小时的工作。
            通过检查自上次“每日 Scrum 站会”以来的工作并预测即将进行的Sprint工作，可以优化团队协作和绩效。
            每日 Scrum 站会每天在同一时间和地点举行，以减少复杂性。
          </p><p>
            开发团队使用每日 Scrum 站会来检查实现Sprint目标的进度，并检查进度如何趋向于完成Sprint待办列表中的工作。
            每日 Scrum 站会可以优化开发团队达到Sprint目标的可能性。
            每天，开发团队都应该了解自己打算如何组成一个自组织团队，以实现Sprint目标并在Sprint结束时创建预期的增量。
          </p>`,
      }
    }, true);
    this.cards = [
      { title: this.translate.instant("sprint_dashboard.burndown"), cols: 2, rows: 1, options: true, },
      { title: this.translate.instant("sprint_dashboard.daily_report"), cols: 2, rows: 2, content: true, },
    ];
    translate.onLangChange.subscribe((event) => {
      this.cards[0].title = this.translate.instant("sprint_dashboard.burndown");
      this.cards[1].title = this.translate.instant("sprint_dashboard.daily_report");
    });
  }

  async ngOnInit() {
    let sprID = this.getRouteParams("sprID");
    this.nowPrj = await this.prjsService.getProjectById(this.nowPrjID);
    let boards = await this.prjsService.getAllBoardByCurrentPrj();
    let board = boards?.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)).filter(board => board.category === BoardCategory.SPRINT)[0];
    const xAxisData = [];
    const estimatedEffort = [];
    const actulaEffort = [];
    const strintCycle = this.nowPrj.cycle / 60 / 60 / 24;  // days
    let totalTime = 0, currentTime = 0;
    board?.cards?.forEach(card => {
      if (!card.belongCardID) return;
      totalTime += card.totalTime;
      currentTime += (card.currentDuration || 0);
    });
    currentTime = totalTime - currentTime;
    // let sprintRecords = await ListSprintRecords({sprintId: {eq: board.id}}),
    //     daysHistory = sprintRecords[0].daysHistory,
    //     daysreports = this.daysreports = daysHistory.map(history => {
    //       return history.reports;
    //     });
    // for (let reports of daysreports) {
    //   for (let report of reports) {
    //     report.username = (await this.usrService.getUserByID(report.userId)).username;
    //   }
    // }
    console.log(this);

    for (let i = 0; i <= strintCycle; ++i) {
      xAxisData.push("Day " + i);
      estimatedEffort.push(totalTime - i / strintCycle * totalTime);
    }
    actulaEffort.push(totalTime);
    // daysHistory.forEach(dh => actulaEffort.push(dh.actualEffort));
    actulaEffort.push(currentTime);

    const estimatedActula = new Array(actulaEffort.length - 1);
    // estimatedActula.push(currentTime);
    for (let i = 0, len = strintCycle - actulaEffort.length + 1, t = currentTime; i <= len; ++i) {
      estimatedActula.push(t - i / len * t);
    }

    [actulaEffort, estimatedEffort, estimatedActula].forEach(arr => {
      arr.forEach((second, i) => {
        arr[i] = (second / 60 / 60).toFixed(2);
      });
    });

    this.options = {
      legend: {
        data: ["Actual Effort", "Estimated Effort", ],
        bottom: 0,
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: xAxisData,
        boundaryGap: false,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          name: "Actual Effort",
          data: actulaEffort,
          type: "line",
          smooth: 0.5,
          areaStyle: {},
          animationDelay: (idx: number) => idx * 10,
        },
        {
          name: 'Estimated Effort',
          data: estimatedEffort,
          type: "line",
          animationDelay: (idx: number) => idx * 10 + 100,
        },
        {
          name: "Actual Effort",
          data: estimatedActula,
          type: "line",
          lineStyle: { type: "dotted" },
          animationDelay: (idx: number) => idx * 10 + 100,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };
  }

  showBurndownHelper = false;
  showDailyReportHelper = false;
  showHelper(card: any) {
    switch(card.title) {
    case this.translate.instant("sprint_dashboard.burndown"):
      this.showBurndownHelper = true;
      break;
    case this.translate.instant("sprint_dashboard.daily_report"):
      this.showDailyReportHelper = true;
      break;
    }
  }
  onCloseHelper() {
    this.showBurndownHelper = this.showDailyReportHelper = false;
  }

}
