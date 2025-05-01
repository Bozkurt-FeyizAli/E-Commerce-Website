import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, orderData);
  }
}
