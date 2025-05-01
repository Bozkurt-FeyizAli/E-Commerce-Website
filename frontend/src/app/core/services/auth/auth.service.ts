import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { SessionService } from 'app/core/services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUsers(): import("../../../shared/models/user").User[] {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private sessionService: SessionService) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userDto);
  }

  logout(): void {
    this.sessionService.clear();  // ✅ Oturumu tamamen temizler
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') {
      return false; // SSR sırasında false dön
    }
    return !!this.sessionService.getToken();
  }


  getToken(): string | null {
    return this.sessionService.getToken();
  }

  getUserRole(): string | null {
    const token = this.sessionService.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }
}
