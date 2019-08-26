import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
      const isAuth = this.userService.getIsAuth();
      if (!isAuth) {
        this.router.navigate(['/login']);
      }
      return isAuth;
  }
}
