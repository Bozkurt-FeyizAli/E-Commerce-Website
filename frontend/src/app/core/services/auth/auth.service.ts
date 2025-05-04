import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { SessionService } from 'app/core/services/session/session.service';
import { User } from '../../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private sessionService: SessionService) {
    const token = this.sessionService.getToken();
    if (token) {
      // Sayfa yenilenince user'ı tekrar yükle
      this.getCurrentUserFromApi().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          this.sessionService.save('user', user);  // ✅ user'ı session'a kaydet
        },
        error: () => {
          this.sessionService.clear();
          this.currentUserSubject.next(null);
        }
      });
    }
  }

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
        this.sessionService.saveToken(response.accessToken);
        this.sessionService.save('refreshToken', response.refreshToken);
        const user = this.getCurrentUserFromApi();
        user.subscribe(user => {
          this.sessionService.save('user', user);  // ✅ User bilgisini session'a kaydet
          this.sessionService.save('role', user.roles);  // ✅ User rolünü session'a kaydet
          this.sessionService.save('username', user.username);  // ✅ User adını session'a kaydet
          this.sessionService.save('email', user.email);  // ✅ User e-posta adresini session'a kaydet
          this.sessionService.save('id', user.id);  // ✅ User ID'sini session'a kaydet
          this.sessionService.save('isLoggedIn', true);  // ✅ Kullanıcının giriş yapıp yapmadığını session'a kaydet
        });
        this.sessionService.save('isLoggedIn', true);  // ✅ Kullanıcının giriş yapıp yapmadığını session'a kaydet

      })
    );
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
    this.sessionService.clear();
    this.currentUserSubject.next(null);  // ✅ logout sonrası sıfırla
  }

  isLoggedIn(): boolean {
    return !!this.sessionService.getToken();
  }

  getToken(): string | null {
    return this.sessionService.getToken();
  }

  getUserRole(): string | null {
    const user = this.sessionService.get<User>('user');
    return user?.roles || null;  // ✅ `roles` değil `role`
  }

  getCurrentUserFromApi(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  private loadCurrentUser(): void {
    this.getCurrentUserFromApi().subscribe({
      next: (user) => console.log('User loaded', user),
      error: (err) => {
        console.error('Failed to load user', err);
        this.sessionService.clear();
        this.currentUserSubject.next(null);
      }
    });
  }

  getUserId(): number | null {
    return this.currentUserSubject.getValue()?.id || null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }
}
