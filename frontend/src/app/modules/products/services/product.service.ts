import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { Product} from '@model/product.model'; // Adjust the import path as necessary
import { CartItem } from '@model/cart-item.model'; // Adjust the import path as necessary
import { OrderItem } from '@model/order-item.model'; // Adjust the import path as necessary
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../shared/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  // Basic Product Operations
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of([]); // Hata durumunda boş array dön
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => new Error(
          error.status === 404 ? 'Product not found' : 'Server error'
        ));
      })
    );
  }

  // Advanced Product Features
  searchProducts(term: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?q=${term}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  filterByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?category=${category}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Relationship Handling
  getProductWithRelations(id: number): Observable<Product> {
    return forkJoin({
      product: this.getProductById(id),
      cartItems: this.http.get<CartItem[]>(`${this.apiUrl}/cartItems?productId=${id}`),
      orderItems: this.http.get<OrderItem[]>(`${this.apiUrl}/orderItems?productId=${id}`)
    }).pipe(
      map(({ product, cartItems, orderItems }) => ({
        ...product,
        cartItems: cartItems.map(ci => ({
          ...ci,
          product: product
        })),
        orderItems: orderItems.map(oi => ({
          ...oi,
          product: product
        }))
      }))
    );
  }

  // Error Handling
  private handleError(error: any) {
    console.error('ProductService Error:', error);
    return throwError(() => new Error(
      error.error?.message || error.message || 'Server error'
    ));
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?featured=true`).pipe(
      catchError(this.handleError)
    );
  }

}
