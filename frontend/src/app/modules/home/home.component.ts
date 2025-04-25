// home.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '@model/product.model';
import { Category } from '@model/category.model';
import { CategoryService } from 'app/modules/category/service/category.service';
import { CartService } from 'app/modules/cart/service/cart.service';
import { HomeService } from './service/home.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  featuredProducts: Product[] = [];
  categories: Category[] = [];

  newsletterForm : FormGroup;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadFeaturedProducts();
    this.loadCategories();

  }

  private loadFeaturedProducts() {
    this.homeService.getFeaturedProducts().subscribe(products => {
      this.featuredProducts = products;
    });
  }

  private loadCategories() {
    this.categoryService.getMainCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  onNewsletterSubmit() {
    if (this.newsletterForm.valid) {
      // Newsletter subscription logic
      console.log('Submitting:', this.newsletterForm.value);
      this.newsletterForm.reset();
    }
  }
}
