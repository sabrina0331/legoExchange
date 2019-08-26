import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Product } from './products.model';

@Injectable({ providedIn: 'root'})
export class ProductsService {
  private products: Product[] = [];
  private productUpdated = new Subject<{products: Product[], productCount: number}>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getProducts(productsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, products: any, maxProducts: number }>('http://localhost:3000/api/products' + queryParams)
      .pipe(
        map(productData => {
        return  {
          products: productData.products.map(product => {
            return {
              title: product.title,
              description: product.description,
              price: product.price,
              location: product.location,
              id: product._id,
              imagePath: product.imagePath,
              creator: product.creator
            };
        }),
          maxProducts: productData.maxProducts
       };
      }))
      .subscribe(transformedProducts => {
        this.products = transformedProducts.products;
        this.productUpdated.next({
          products: [...this.products],
          productCount: transformedProducts.maxProducts
        });
      });
  }

  getProductUpdateListener() {
    return this.productUpdated.asObservable();
 }

  getProduct(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      description: string,
      price: number,
      location: string, imagePath: string, creator: string; }>('http://localhost:3000/api/products/' + id);
  }


  addProduct(title: string, description: string, price: any, location: string, image: File ) {
    const responseData = new FormData();
    responseData.append('title', title);
    responseData.append('description', description);
    responseData.append('price', price);
    responseData.append('location', location);
    responseData.append('image', image, title);
    this.http
      .post<{message: string, product: Product }>('http://localhost:3000/api/products', responseData)
      .subscribe(postData => {
        this.router.navigate(['/']);
      });
  }

  updateProduct(id: string, title: string, description: string, price: any, location: string, image: File | string) {
    let newProduct: Product | FormData;
    if (typeof(image) === 'object') {
      newProduct = new FormData();
      newProduct.append('id', id);
      newProduct.append('title', title);
      newProduct.append('description', description);
      newProduct.append('price', price);
      newProduct.append('location', location);
      newProduct.append('image', image, title);
    } else {
      newProduct = {
        id: id,
        title: title,
        description: description,
        price: price,
        location: location,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put('http://localhost:3000/api/products/' + id, newProduct)
      .subscribe(result => {
        this.router.navigate(['/']);
      });
  }

  deleteProduct(productId: string) {
    return this.http.delete('http://localhost:3000/api/products/' + productId);
  }
}
