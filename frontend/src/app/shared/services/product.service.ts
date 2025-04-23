import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private featuredProductsUrl = 'http://localhost:3000/products/featured';
  private allProductsUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.featuredProductsUrl);
  }
}
