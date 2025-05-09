import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'app/shared/models/user';
import { Order } from 'app/shared/models/order';  // Order modelin varsa
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/me`, user);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/my`);
  }

  changePassword(data: { oldPassword: string, newPassword: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/me/password`, data);
  }

  uploadProfileImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/me/profile-image`, formData, { responseType: 'text' });
  }
}
