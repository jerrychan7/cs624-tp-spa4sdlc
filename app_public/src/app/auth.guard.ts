import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private getRouteParams(param: string) {
    let r: ActivatedRoute | null = this.actRoute;
    while (r) {
      let id = r.snapshot.paramMap.get(param);
      if (id) return id;
      r = r.parent;
    }
    return "";
  }

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private usrService: UserService,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.usrService.isLoggedIn()) {
      let pid = this.getRouteParams("prjID");
      // console.log(pid, this.usrService.getCurrentUser());
      if (pid && this.usrService.getCurrentUser()?.projectId.find(prj => prj == pid))
        return true;
      return !pid;
    }
    this.router.navigateByUrl('/usr/sign-in-or-sign-up');
    return false;
    // return this.usrService.asyncCurrentUserInfo().then(usr => {
    //   if (!usr) {
    //     this.router.navigateByUrl('/usr/sign-in-or-sign-up');
    //     return false;
    //   }
    //   return true;
    // });
  }
}
