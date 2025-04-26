import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@model/user.model';
import { environment } from '../../../shared/environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUsers(): User[] {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // Kullanıcı girişi (login)
  login(credentials: { email: string, password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      catchError(error => {
        console.error('Login error: ', error);
        // Better error handling, throwing error instead of returning empty token
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }

  // Kullanıcı kaydı (register)
  register(userData: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      catchError(error => {
        console.error('Registration error: ', error);
        // Returning a descriptive error
        return throwError(() => new Error('Registration failed. Please try again.'));
      })
    );
  }

  // Kullanıcı giriş durumunu kontrol etme
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Token'ı almak
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Kullanıcı çıkışı (logout)
  logout(): void {
    localStorage.removeItem('token'); // Çıkış işlemi
  }
}
