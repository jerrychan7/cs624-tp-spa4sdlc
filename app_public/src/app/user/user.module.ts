import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from "./user.component";
import { SignOnOrSignUpComponent } from './sign-on-or-sign-up/sign-on-or-sign-up.component';


@NgModule({
  declarations: [
    UserComponent,
    SignOnOrSignUpComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', pathMatch: 'full', component: SignOnOrSignUpComponent,
    }, {
      path: ":usrID",
      component: UserComponent,
    }, ]),
    TranslateModule.forChild({
      defaultLanguage: "en",
    }),

    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule, ReactiveFormsModule,
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'legacy'}}
  ],
})
export class UserModule { }
