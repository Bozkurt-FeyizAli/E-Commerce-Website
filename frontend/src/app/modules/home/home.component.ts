// home.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'app/shared/a.ts/product.model';
import { Category } from 'app/shared/a.ts/category.model';
import { ProductService } from '@services/product.service';
import { CategoryService } from '@services/category.service';
import { CartService } from '@services/cart.service';

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
    private productService: ProductService,
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
    this.productService.getFeaturedProducts().subscribe(products => {
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
