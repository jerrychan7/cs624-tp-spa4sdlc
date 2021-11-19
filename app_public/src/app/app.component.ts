import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spa4sdlc';
  constructor(
    public translate: TranslateService,
  ) {
    translate.setTranslation("en", {
      "topNav": {
        "official_guide": "Official Guide",
      }
    }, true);
    translate.setTranslation("zh_cn", {
      "topNav": {
        "official_guide": "官方指南",
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
