import { Component, OnInit } from '@angular/core';
import { CartService } from './service/cart.service';
import { CartItem } from '@model/cart-item';
import { Product } from '@model/product';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
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
        if (!items || items.length === 0) {
          this.loading = false;
          return of([]);
        }
        return forkJoin(
          items.map(item =>
            this.cartService.getProductById(item.productId).pipe(
              map(product => ({ item, product })),
              catchError(err => {
                console.error('Ürün alınamadı:', err);
                return of({ item, product: this.getPlaceholderProduct() });  // fallback
              })
            )
          )
        );
      }),
      tap(() => this.loading = false)
    );

    this.totalPrice$ = this.cartItems$.pipe(
      map(items =>
        items.reduce((total, entry) => {
          const quantity = entry.item.quantity ?? 1;
          const price = entry.product.price ?? 0;
          return total + (quantity * price);
        }, 0)
      )
    );
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.cartService.updateQuantity(item.id, newQuantity).subscribe({
      next: () => {
        this.showSuccess('Quantity updated successfully');
        this.loadCart();  // güncel listeyi yenile
      },
      error: () => this.showError('Failed to update quantity')
    });
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        this.showSuccess('Item removed from cart');
        this.loadCart();  // güncel listeyi yenile
      },
      error: () => this.showError('Failed to remove item')
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.showSuccess('Cart cleared successfully');
        this.loadCart();  // tamamen yenile
      },
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

  private getPlaceholderProduct(): Product {
    return {
      id: 0,
      name: 'Unknown Product',
      description: 'No details available',
      price: 0,
      stock: 0,
      mainImageUrl: 'assets/images/product-placeholder.png',
      discountPercentage: undefined,
      ratingAverage: undefined,
      category: { id: 0, name: 'Unknown Category' },
      isActive: false,
      createdAt: new Date()
    };
  }
}
