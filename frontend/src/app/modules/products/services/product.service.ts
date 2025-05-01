import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { Product } from '@models/product';
import { CartItem } from '@models/cart-item';
import { OrderItem } from '@models/order-item';
import { Category } from '@models/category';
import { ProductImage } from '@models/product-image';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // ✅ 1️⃣ Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      catchError((error) => {
        console.error('API Error (getProducts):', error);
        return of([]);
      })
    );
  }

  // ✅ 2️⃣ Get single product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError((error) => {
        console.error('API Error (getProductById):', error);
        return throwError(() =>
          new Error(
            error.status === 404 ? 'Product not found' : 'Server error'
          )
        );
      })
    );
  }

  // ✅ 3️⃣ Get categories (tamamlandı)
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError((error) => {
        console.error('API Error (getCategories):', error);
        return of([]);
      })
    );
  }

  // ✅ 4️⃣ Search products by term
  searchProducts(term: string): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/products/search?query=${term}`)
      .pipe(catchError(this.handleError));
  }

  // ✅ 5️⃣ Filter products by category name (string)
  filterByCategory(category: string): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/products?category=${category}`)
      .pipe(catchError(this.handleError));
  }

  // ✅ 6️⃣ Filter by categoryId (numeric ID bazlı)
  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`)
      .pipe(catchError(this.handleError));
  }

  // ✅ 7️⃣ Get featured products
  getFeaturedProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/products?featured=true`)
      .pipe(catchError(this.handleError));
  }

  // ✅ 8️⃣ Get product images (opsiyonel)
  getProductImages(productId: number): Observable<ProductImage[]> {
    return this.http
      .get<ProductImage[]>(`${this.apiUrl}/products/${productId}/images`)
      .pipe(catchError(this.handleError));
  }

  // ✅ 9️⃣ Get product with cart & order relations
  getProductWithRelations(id: number): Observable<Product> {
    return forkJoin({
      product: this.getProductById(id),
      cartItems: this.http.get<CartItem[]>(
        `${this.apiUrl}/cartItems?productId=${id}`
      ),
      orderItems: this.http.get<OrderItem[]>(
        `${this.apiUrl}/orderItems?productId=${id}`
      )
    }).pipe(
      map(({ product, cartItems, orderItems }) => ({
        ...product,
        cartItems: cartItems.map((ci) => ({
          ...ci,
          product: product
        })),
        orderItems: orderItems.map((oi) => ({
          ...oi,
          product: product
        }))
      }))
    );
  }

  // ✅ Error handler (ortak kullanım)
  private handleError(error: any) {
    console.error('ProductService Error:', error);
    return throwError(() =>
      new Error(error.error?.message || error.message || 'Server error')
    );
  }

  getNewArrivals(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?sort=createdAt,desc&limit=8`)
      .pipe(catchError(this.handleError));
  }

}
