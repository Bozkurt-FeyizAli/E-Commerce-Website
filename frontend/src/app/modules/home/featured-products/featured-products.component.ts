import { Component, OnInit } from '@angular/core';
import { Product } from '@model/product';
import { HomeService } from '../service/home.service';
import { CartService } from 'app/modules/cart/service/cart.service';

@Component({
  selector: 'app-featured-products',
  standalone: false,
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css']
})
export class FeaturedProductsComponent implements OnInit {
  featuredProducts: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private homeService: HomeService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.homeService.getFeaturedProducts().subscribe({
      next: (data) => {
        this.featuredProducts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load featured products.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  handleImageError(event: Event): void {
    
  }

}
