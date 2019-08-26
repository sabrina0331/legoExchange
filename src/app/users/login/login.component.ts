import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})


export class LoginComponent implements OnInit, OnDestroy {
  loading = false;
  private authStatusSub: Subscription;

  constructor(
    public userService: UserService
  ) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.userService.userLogin(form.value.email, form.value.password);
  }


  ngOnInit() {
    this.authStatusSub = this.userService.getAuthStatusListener().subscribe(
      authStatus => {
        this.loading = false;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
