import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl="http://localhost:3000/api/auth";
  constructor(private http: HttpClient) { }
  login(credentials: {email: string, password: string}) {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, credentials);
  }

  register(userData: User) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
