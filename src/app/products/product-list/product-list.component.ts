import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from '../products.model';
import { ProductsService } from '../products.service';
import { PageEvent } from '@angular/material';
import { UserService } from '../../users/user.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {


  products: Product[] = [];
  loading = false;
  totalPages = 0;
  productsPerpage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  product: string;
  thisUser: any;

  private productsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public productsService: ProductsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.productsService.getProducts(this.productsPerpage, this.currentPage);
    this.userId = this.userService.getUserId();
    this.productsSub = this.productsService.getProductUpdateListener()
      .subscribe((productData: { products: Product[], productCount: number }) => {
        this.loading = false;
        this.totalPages = productData.productCount;
        this.products = productData.products;
      });
    this.userIsAuthenticated = this.userService.getIsAuth();
    this.authStatusSub = this.userService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.userService.getUserId();
      });
  }

  changedPage(pageData: PageEvent) {
    this.loading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerpage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerpage, this.currentPage);
  }


  onDelete(productId: string) {
    this.loading = true;
    this.productsService.deleteProduct(productId).subscribe(() => {
      this.productsService.getProducts(this.productsPerpage, this.currentPage);
    });
  }

  // onContact(userId: string) {
  //   console.log(userId);
  //   this.userService.getUser(userId).subscribe(response => {
  //     this.thisUser = response.email;
  //     // this.userService.getUser = this.thisUser;
  //     // console.log(this.thisUser.email);
  //   });
  // }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
