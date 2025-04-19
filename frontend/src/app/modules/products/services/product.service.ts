import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/models/product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }
}
