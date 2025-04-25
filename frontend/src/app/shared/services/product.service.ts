import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'app/shared/a.ts/product.model';
import { environment } from '../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productUrl);
  }
}
