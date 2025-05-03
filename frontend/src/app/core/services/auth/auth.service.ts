import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    const params = new HttpParams()
      .set('email', credentials.email)
      .set('password', credentials.password);
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.apiUrl}/login`,
      null,
      { params }
    ).pipe(
      tap(response => {
        this.sessionService.saveToken(response.accessToken);  // accessToken
        this.sessionService.save('refreshToken', response.refreshToken);  // refreshToken
      })
    )


  }

  register(userDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userDto);
  }

  logout(): void {
    const refreshToken = this.sessionService.get('refreshToken');
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, null, {
        params: new HttpParams().set('refreshToken', String(refreshToken))
      }).subscribe({
        next: () => console.log('Logged out from server'),
        error: err => console.error('Logout failed', err)
      });
    }
    this.sessionService.clear();  // Frontend tarafını temizle
  }



  isLoggedIn(): boolean {
    if (typeof window === 'undefined') {
      return false;
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
