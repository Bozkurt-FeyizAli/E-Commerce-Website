import { Injectable } from '@angular/core';
import { Product } from '../../../shared/models/product.model';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  apiUrl= 'http://localhost:3000'; // Base URL for json-server
  constructor(private http: HttpClient) { }
  addItem(product: Product){}
  addToCart(p: Product): Observable<Product[]>{
    return new Observable<Product[]>;
  }
  getProductById(id: number): Observable<Product> {
    if (isNaN(id)) {
      return throwError(() => new Error('Geçersiz ürün IDsi'));
    }

    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(error => {
        console.error('API Hatası:', error);
        return throwError(() => new Error(
          error.status === 404 ? 'Ürün bulunamadı' : 'Sunucu hatası'
        ));
      })
    );
  }
}
