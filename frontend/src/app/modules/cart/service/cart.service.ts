import { Injectable } from '@angular/core';
import { Product } from '@model/product';
import { Observable, BehaviorSubject, throwError, of, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { CartItem } from '@model/cart-item';
import { environment } from '../../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  currentCart$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialCart();
  }

  private loadInitialCart(): void {
    this.http.get<{ items: CartItem[] }>(`${this.apiUrl}/1`).pipe(
      map(response => response.items),
      catchError(() => of([]))
    ).subscribe(items => this.cartItems.next(items));
  }

  addToCart(product: Product, quantity: number = 1): Observable<CartItem[]> {
    const newItem: Partial<CartItem> = {
      productId: product.id,
      quantity,
    };

    return this.http.patch<{ items: CartItem[] }>(`${this.apiUrl}/1`, {
      items: [...this.cartItems.value, newItem]
    }).pipe(
      map(response => response.items),
      tap(items => this.cartItems.next(items)),
      catchError(this.handleError)
    );
  }

  removeFromCart(itemId: number): Observable<CartItem[]> {
    const updatedItems = this.cartItems.value.filter(item => item.id !== itemId);
    return this.updateCartItems(updatedItems);
  }

  updateQuantity(itemId: number, newQuantity: number): Observable<CartItem[]> {
    const updatedItems = this.cartItems.value.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    return this.updateCartItems(updatedItems);
  }

  public clearCart(): Observable<CartItem[]> {
    return this.updateCartItems([]);
  }

  private updateCartItems(items: CartItem[]): Observable<CartItem[]> {
    return this.http.patch<{ items: CartItem[] }>(`${this.apiUrl}/1`, { items }).pipe(
      map(response => response.items),
      tap(items => this.cartItems.next(items)),
      catchError(this.handleError)
    );
  }

  getCartTotal(): Observable<number> {
    return this.currentCart$.pipe(
      switchMap(items =>
        items.length > 0
          ? forkJoin(
              items.map(item =>
                this.getProductById(item.productId).pipe(
                  map(product => product.price * item.quantity)
                )
              )
            ).pipe(
              map(prices => prices.reduce((acc, curr) => acc + curr, 0))
            )
          : of(0)
      )
    );
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${productId}`).pipe(
      catchError(error => {
        console.error('Product fetch error:', error);
        return throwError(() => new Error('Ürün bilgileri alınamadı'));
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Cart error:', error);
    return throwError(() => new Error(
      error.error?.message || 'Sepet işlemi sırasında bir hata oluştu'
    ));
  }


}
