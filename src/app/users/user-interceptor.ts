import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class UserInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.userService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('authorization', 'Bearer ' + authToken)
  // name in set should be the same as in check-auth.js
    });
    return next.handle(authRequest);
  }
}
