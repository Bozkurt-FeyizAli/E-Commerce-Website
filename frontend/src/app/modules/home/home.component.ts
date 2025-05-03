// home.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '@model/product';
import { Category } from '@model/category';
import { CategoryService } from 'app/modules/category/service/category.service';
import { CartService } from 'app/modules/cart/service/cart.service';
import { HomeService } from './service/home.service';
import { AuthService } from 'app/core/services/auth/auth.service';

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
    private cartService: CartService,
    private authService: AuthService
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
    if (!this.authService.isLoggedIn()) {
      alert('Lütfen önce giriş yapın.');
      return;
    }
    if (product.stock <= 0) {
      alert('Bu ürün stokta yok.');
      return;
    }
    this.cartService.addToCart(product);
  }

  onNewsletterSubmit() {
    if (this.newsletterForm.valid) {
      console.log('Newsletter subscription:', this.newsletterForm.value.email);
      // TODO: Burada backend'e gönderim yapılabilir
      this.newsletterForm.reset();
    }
  }

  handleImageError($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement;
    target.src = 'assets/images/product-placeholder.png';
    target.onerror = null; // Prevents infinite loop if the placeholder image fails to load
    }

}
