import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../Types';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  nowUsr: User | null = null;
  set usrID(uid: string | null) {
    if (!uid) return;
    // this.usrService.asyncCurrentUserInfo();
    this.usrService.getUserByID(uid).then(usr => this.nowUsr = usr);
  }

  constructor(
    public translate: TranslateService,
    public usrService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    translate.setTranslation("en", {
      "user_info": {
        "user_information": "User information",
        "user_id": "User ID:",
        "username": "Username:",
        "email": "Email:",
        "email_verified": "Email verified:",
        "sign_out": "Sign out",
      },
    }, true);
    translate.setTranslation("zh_cn", {
      "user_info": {
        "user_information": "用户信息",
        "user_id": "用户 ID：",
        "username": "用户名：",
        "email": "邮箱：",
        "email_verified": "邮箱是否验证：",
        "sign_out": "登出",
      },
    }, true);
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.usrID = routeParams.get('usrID');
  }

  onSignOutBtnClick() {
    this.usrService.signOut();
    this.router.navigateByUrl('/usr/sign-in-or-sign-up');
  }

}
