import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})


export class RegisterComponent implements OnInit, OnDestroy {
  loading = false;
  private authStatusSub: Subscription;

  constructor(
    public userService: UserService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.userService.getAuthStatusListener().subscribe(
      authStatus => {
        this.loading = false;
      }
    );
  }

  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.userService.createUser( form.value.email, form.value.password);

  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
