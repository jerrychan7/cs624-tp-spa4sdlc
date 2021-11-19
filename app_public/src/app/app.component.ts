import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spa4sdlc';
  subcomponentRef: any;
  onActivate(componentRef: any) {
    this.subcomponentRef = componentRef;
  }
  onChangeLang(lang: string) {
    // this.translate.use(lang);
  }
}
