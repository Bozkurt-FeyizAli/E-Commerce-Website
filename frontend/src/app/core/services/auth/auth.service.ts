import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@model/user.model';
import { environment } from '../../../shared/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUsers(): User[] {
    throw new Error('Method not implemented.');
  }

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly ROLES = 'USER_ROLES';


  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // Kullanıcı girişi (login)
  login(credentials: {form: FormGroup }): Observable<boolean> {
    return this.http.post<any>('/api/auth/login', credentials).pipe(
      tap(res => this.storeTokens(res)),
      map(() => true)
    );
  }
  private storeTokens(authResult: any) {
    localStorage.setItem(this.JWT_TOKEN, authResult.token);
    localStorage.setItem(this.ROLES, JSON.stringify(authResult.roles));
  }

  register(userData: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      catchError(error => {
        console.error('Registration error: ', error);
        return throwError(() => new Error('Registration failed. Please try again.'));
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  getJwtToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.ROLES);
  }

  getRoles(): string[] {
    return JSON.parse(localStorage.getItem(this.ROLES) || '[]');
  }
}
