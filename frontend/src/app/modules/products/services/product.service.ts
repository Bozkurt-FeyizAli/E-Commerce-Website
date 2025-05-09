import { AuthService } from 'app/core/services/auth/auth.service';
import { CategoryService } from './../../category/service/category.service';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { Product } from '@model/product';
import { CartItem } from '@model/cart-item';
import { OrderItem } from '@model/order-item';
import { Category } from '@model/category';
import { ProductImage } from '@model/product-image';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Review } from '@model/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;
  ;

  constructor(private http: HttpClient, private categoryService: CategoryService, private authService: AuthService) {}


  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
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
    return this.http.get<Category[]>(`${this.apiUrl}/category`).pipe(
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
      .get<Product[]>(`${this.apiUrl}/category/${categoryId}/products`)
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

  getProductsByCategory(categoryId: number, sortOption: string) {
    return this.http.get<Product[]>(`${this.apiUrl}/products?categoryId=${categoryId}&sort=${sortOption}`)
      .pipe(catchError(this.handleError));
  }

  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/product/${productId}`);
  }

  submitReview(review: { productId: number; rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews`, review);
  }


}
