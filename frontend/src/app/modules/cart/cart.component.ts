import { Component, OnInit } from '@angular/core';
import { CartService } from './service/cart.service';
import { CartItem } from '@model/cart-item';
import { Product } from '@model/product';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<{ item: CartItem, product: Product }[]>;
  totalPrice$!: Observable<number>;
  loading = true;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.cartItems$ = this.cartService.currentCart$.pipe(
      switchMap(items => {
        if (items.length === 0) {
          this.loading = false;
          return of([]);
        }
        return forkJoin(
          items.map(item =>
            this.cartService.getProductById(item.productId).pipe(
              map(product => ({ item, product }))
            )
          )
        );
      }),
      tap(() => this.loading = false)
    );

    this.totalPrice$ = this.cartItems$.pipe(
      map(items =>
        items.reduce((total, entry) => total + (entry.item.quantity * entry.product.price), 0)
      )
    );
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.cartService.updateQuantity(item.id, newQuantity).subscribe({
      next: () => this.showSuccess('Quantity updated successfully'),
      error: () => this.showError('Failed to update quantity')
    });
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => this.showSuccess('Item removed from cart'),
      error: () => this.showError('Failed to remove item')
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => this.showSuccess('Cart cleared successfully'),
      error: () => this.showError('Failed to clear cart')
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/product-placeholder.png';
  }
}
