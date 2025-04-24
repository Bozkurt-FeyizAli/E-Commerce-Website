import { environment } from '../../shared/environments/environment';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private jwtHelper = new JwtHelperService();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    if (this.isBrowser) {
      const token = this.getToken();
      if (token && !this.isTokenExpired(token)) {
        this.setAuthState(token);
      }
    }
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(credentials: { email: string; password: string }): Observable<boolean> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthentication(response.token)),
      map(() => true),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Invalid credentials or server error'));
      })
    );
  }

  register(userData: any): Observable<boolean> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => this.handleAuthentication(response.token)),
      map(() => true),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Registration failed'));
      })
    );
  }

  logout(): void { // DÜZELTİLDİ: "ogout" -> "logout"
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return true;
    // const token = this.getToken();
    // return !!token && !this.isTokenExpired(token);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('auth_token') : null;
  }

  private handleAuthentication(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('auth_token', token);
    }
    this.setAuthState(token);
  }

  private setAuthState(token: string): void {
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.currentUserSubject.next({
      id: decodedToken.sub,
      email: decodedToken.email,
      roles: decodedToken.roles || []
    });
  }

  private isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  hasRole(requiredRole: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes(requiredRole);
  }
}
