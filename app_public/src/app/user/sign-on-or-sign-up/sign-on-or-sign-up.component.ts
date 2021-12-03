import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-on-or-sign-up',
  templateUrl: './sign-on-or-sign-up.component.html',
  styleUrls: ['./sign-on-or-sign-up.component.css'],
  animations: [
    trigger('cardFlip', [
      state('signIn', style({
        transform: 'none'
      })),
      state('signUp', style({
        transform: 'rotateY(180deg)'
      })),
      transition('signIn => signUp', animate('500ms ease-out')),
      transition('signUp => signIn', animate('500ms ease-in'))
    ])
  ]
})
export class SignOnOrSignUpComponent implements OnInit {

  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    private usrService: UserService,
    private router: Router,
  ) {
    translate.setTranslation("en", {
      "sign_in_or_up": {
        "sign_in": "Sign in",
        "sign_up": "Sign up",
        "username": "Username",
        "password": "Password",
        "confirmPwd": "Confirm password",
        "email": "Email",
        "confirm": "Confirm",
        "error": {
          "username": {
            "required": "Username is <b>required</b>.",
          },
          "password": {
            "required": "Password is <b>required</b>.",
            "minlength": "Too short.",
          },
          "confirmPwd": {
            "required": "Confirm password is <b>required</b>.",
            "mustMatch": "Does not match the password.",
          },
          "email": {
            "not_valid": "Please enter a valid email address.",
            "required": "Email is <b>required</b>.",
          },
        },
      },
    }, true);
    translate.setTranslation("zh_cn", {
      "sign_in_or_up": {
        "sign_in": "登录",
        "sign_up": "注册",
        "username": "用户名",
        "password": "密码",
        "confirmPwd": "确认密码",
        "email": "邮箱",
        "confirm": "确认",
        "error": {
          "username": {
            "required": "用户名是<b>必须</b>的。",
          },
          "password": {
            "required": "密码是<b>必须</b>的。",
            "minlength": "太短了。",
          },
          "confirmPwd": {
            "required": "该字段是<b>必须</b>的。",
            "mustMatch": "和原密码不匹配。",
          },
          "email": {
            "not_valid": "请输入一个合法的邮箱地址。",
            "required": "邮箱是<b>必须</b>的。",
          }
        },
      },
    }, true);
  }

  cardFlipState = 'signIn';
  passwordHide = true;
  toggleFlip() {
    this.cardFlipState = this.cardFlipState == 'signIn'? 'signUp': 'signIn';
    this.passwordHide = true;
    this.initOrResetFormGroup();
  }

  private ComparePassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors["mustMatch"]) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  signInFormGroup: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  signUpFormGroup: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPwd: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  }, {
    validator: this.ComparePassword("password", "confirmPwd"),
  });
  private initOrResetFormGroup() {
    this.signInFormGroup.reset();
    this.signUpFormGroup.reset();
  }

  async onSignIn() {
    const {username, password} = this.signInFormGroup.getRawValue();
    let loginFailed = await this.usrService.login(username, password);
    if (!loginFailed) {
      this.router.navigateByUrl('/user/' + this.usrService.currentUserInfo()?.id);
    }
  }
  async onSignUp() {
    const {username, password, email} = this.signUpFormGroup.getRawValue();
    await this.usrService.registerUser(username, password, email);
  }


  ngOnInit(): void {
    this.initOrResetFormGroup();
  }

}
