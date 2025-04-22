import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '@models/product.model';
import { CartItem } from '@models/cart-item.model';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-view',
  standalone: false,
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css']
})
export class CartViewComponent implements OnInit {
  cartItems$!: Observable<{ item: CartItem, product: Product }[]>;
  total$! : Observable<Number>;
  loading = true;

  constructor(
    public cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.total$ = this.cartService.currentCart$.pipe(
      map(items => items.reduce((total, item) => total + (item.priceAtAddition * item.quantity), 0))
    );
  }

  private loadCartItems(): void {
    this.cartItems$ = this.cartService.currentCart$.pipe(
      switchMap((items: CartItem[]) =>
        items.length > 0
          ? forkJoin(items.map((item: CartItem) =>
              this.cartService.getProductById(item.productId).pipe(
                map(product => ({ item, product }))
              )
            ))
          : of([])
      ),
      tap(() => (this.loading = false))
    );
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.cartService.updateQuantity(item.id, newQuantity).subscribe({
      error: () => this.showError('Miktar güncellenemedi')
    });
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => this.showSuccess('Ürün sepetten kaldırıldı'),
      error: () => this.showError('Ürün kaldırılamadı')
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Kapat', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Kapat', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
