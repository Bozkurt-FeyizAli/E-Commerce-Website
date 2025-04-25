import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/shared/a.ts/user.model';
import { environment } from '../../../shared/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
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
