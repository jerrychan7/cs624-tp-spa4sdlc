import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spa4sdlc';
  get isPrj() { return this.location.path().startsWith("/prj"); }
  get isPrjDB() { return this.location.path() == "/prj/dashboard"; }
  get isUsr() { return this.location.path().startsWith("/user"); }

  constructor(
    public translate: TranslateService,
    public usrSvr: UserService,
    public location: Location,
  ) {
    translate.setTranslation("en", {
      "topNav": {
        "official_guide": "Official Guide",
        "use_after_login": "You can use the system after logging in.",
      }
    }, true);
    translate.setTranslation("zh_cn", {
      "topNav": {
        "official_guide": "官方指南",
        "use_after_login": "请在登录后使用本系统。",
      }
    }, true);
  }
  subcomponentRef: any;
  onActivate(componentRef: any) {
    this.subcomponentRef = componentRef;
  }
  onChangeLang(lang: string) {
    this.translate.use(lang);
  }
}
