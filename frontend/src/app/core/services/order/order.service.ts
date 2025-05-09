import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Order } from '@model/order';
import { PaymentMethod } from '@model/payment-method.enum';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  checkout(dto: {
    userId: number;
    paymentMethod: PaymentMethod;
    paymentIntentId?: string;
    address: {
      line: string; city: string; state: string;
      postalCode: string; country: string;
    };
  }): Observable<Order> {
    return this.http.post<Order>(`${this.api}/checkout`, {
      userId: dto.userId,
      paymentMethod: dto.paymentMethod,
      paymentIntentId: dto.paymentIntentId,
      shippingAddressLine: dto.address.line,
      shippingCity: dto.address.city,
      shippingState: dto.address.state,
      shippingPostalCode: dto.address.postalCode,
      shippingCountry: dto.address.country
    });
  }

  getUserOrders(userId: number) {
    return this.http.get<Order[]>(`${this.api}?userId=${userId}`);
  }
}
