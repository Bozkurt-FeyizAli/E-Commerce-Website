import { AuthService } from './../../../core/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { Product } from '@model/product';
import { Observable, BehaviorSubject, throwError, of, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { CartItem } from '@model/cart-item';
import { environment } from '../../../shared/environments/environment';
import { Cart } from '@model/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = `${environment.apiUrl}/cart`;
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  currentCart$ = this.cartItems.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    // Login durumu değiştiğinde sepete göre aksiyon al
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadInitialCart();
      } else {
        this.cartItems.next([]); // logout oldun, sepeti sıfırla
      }
    });
  }

  private loadInitialCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.cartItems.next([]);
      return;
    }

    const userId = this.authService.getUserId(); // ✅ ID’yi dinamik çek
    if (!userId) {
      console.error('User ID bulunamadı!');
      this.cartItems.next([]);
      return;
    }

    this.http.get<Cart>(`${this.apiUrl}/user/${userId}`).pipe(
      map(response => response.items), // ✅ response.items olmalı
      catchError(() => of([]))
    ).subscribe(items => this.cartItems.next(items));
  }


  addToCart(product: Product, quantity: number = 1): Observable<CartItem> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('Giriş yapmadan sepete ekleme yapılamaz.'));
    }

    const cartItem: Partial<CartItem> = {
      productId: product.id,
      quantity,
    };

    return this.http.post<CartItem>(`${this.apiUrl}/${userId}/items`, cartItem).pipe(
      tap(() => {
        this.loadInitialCart(); // Ekleme sonrası otomatik güncelle
      }),
      catchError(this.handleError)
    );
  }

  removeFromCart(itemId: number): Observable<CartItem[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('Giriş yapmadan sepetten silme yapılamaz.'));
    }

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
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('Giriş yapmadan sepet güncellenemez.'));
    }

    return this.http.patch<{ items: CartItem[] }>(`${this.apiUrl}/${userId}`, { items }).pipe(
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

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

}
