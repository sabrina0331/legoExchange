import { Component, OnInit } from '@angular/core';
import { Product } from './products/products.model';
import { UserService } from './users/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private userService: UserService
  ) {}
  storedProducts: Product[] = [];


  onProductAdded(product) {
    this.storedProducts.push(product);
  }

  ngOnInit() {
    this.userService.autoAuthUser();
  }
}
