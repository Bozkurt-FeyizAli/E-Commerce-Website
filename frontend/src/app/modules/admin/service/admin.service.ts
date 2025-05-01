import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '@models/order';
import { Product } from '@models/product';
import { environment } from '../../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getRecentOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/recent-orders`);
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock-products`);
  }
}
