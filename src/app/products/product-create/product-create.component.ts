import { Component, OnInit } from '@angular/core';
import { Product } from '../products.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})

export class ProductCreateComponent implements OnInit {

  enteredTitle = '';
  enteredDescription = '';
  enteredPrice = null ;
  enteredLocation = '';
  product: Product;
  loading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private productId: string;


  constructor(
    public productsService: ProductsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, {
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        validators: [Validators.required]
      }),
      location: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.loading = true;
        this.productsService.getProduct(this.productId).subscribe(postData => {
          this.loading = false;
          this.product = {
            id: postData._id,
            title: postData.title,
            description: postData.description,
            price: postData.price,
            location: postData.location,
            imagePath: postData.imagePath,
            creator: postData.creator
        };
          this.form.setValue({
            title: this.product.title,
            description: this.product.description,
            price: this.product.price,
            location: this.product.location,
            image: this.product.imagePath
            });
        });
      } else {
        this.mode = 'create';
        this.productId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveProduct() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.mode === 'create') {
      this.productsService.addProduct(
        this.form.value.title,
        this.form.value.description,
        this.form.value.price,
        this.form.value.location,
        this.form.value.image
      );
    } else {
      this.productsService.updateProduct(
        this.productId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.price,
        this.form.value.location,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
