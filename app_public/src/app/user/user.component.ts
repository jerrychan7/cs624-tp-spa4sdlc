import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  nowUsr: any = {
    id: "132",
    username: "asdf",
    email: "email",
    email_verified: true,
  };

  constructor(
    public translate: TranslateService,
  ) {
    translate.setTranslation("en", {
      "user_info": {
        "user_information": "User information",
        "user_id": "User ID:",
        "username": "Username:",
        "email": "Email:",
        "email_verified": "Email verified:",
      },
    }, true);
    translate.setTranslation("zh_cn", {
      "user_info": {
        "user_information": "用户信息",
        "user_id": "用户 ID：",
        "username": "用户名：",
        "email": "邮箱：",
        "email_verified": "邮箱是否验证：",
      },
    }, true);
  }

  ngOnInit(): void {
  }

}
