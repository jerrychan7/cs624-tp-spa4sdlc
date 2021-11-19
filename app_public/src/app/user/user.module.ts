import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


import { UserComponent } from "./user.component";


@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', pathMatch: 'full', component: UserComponent,
    }, ]),
    TranslateModule.forChild({
      defaultLanguage: "en",
    }),
  ]
})
export class UserModule { }
