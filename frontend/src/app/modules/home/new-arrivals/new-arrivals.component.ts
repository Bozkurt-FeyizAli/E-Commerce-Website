import { Component, OnInit } from '@angular/core';
import { Product } from '@model/product';
import { HomeService } from '../service/home.service';
import { CartService } from 'app/modules/cart/service/cart.service';

@Component({
  selector: 'app-new-arrivals',
  standalone: false,
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.css']
})
export class NewArrivalsComponent implements OnInit {
  newArrivals: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private homeService: HomeService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.homeService.getNewArrivals().subscribe({
      next: (data) => {
        this.newArrivals = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load new arrivals.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/category-placeholder.png';
  }

}
