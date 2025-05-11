import { StorageService } from './../storage/storage.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { SessionService } from 'app/core/services/session/session.service';
import { User } from '../../../shared/models/user';
import { get } from 'http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private sessionService: SessionService, private storageService: SessionService, private router: Router) {
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

    return this.http.post<{ accessToken: string; refreshToken: string; user: User }>(
      `${this.apiUrl}/login`,
      null,
      { params }
    ).pipe(
      tap(response => {
        const user = response.user;
        const roleNames = user.roles.map((r: any) => `ROLE_${r.name}`);
        console.log('✅ DOĞRU ROL STRİNG DİZİSİ:', roleNames);

        this.sessionService.saveToken(response.accessToken);
        this.sessionService.save('refreshToken', response.refreshToken);
        this.sessionService.save('user', user);
        this.sessionService.save('role', roleNames);
        this.sessionService.save('username', user.username);
        this.sessionService.save('email', user.email);
        this.sessionService.save('id', user.id);
        this.sessionService.save('isLoggedIn', true);

        this.storageService.save('user', user);
        this.storageService.save('role', roleNames);
        this.storageService.save('username', user.username);
        this.storageService.save('email', user.email);
        this.storageService.save('id', user.id);

        this.currentUserSubject.next(user);

        // ✅ Burası kritik → Header ve diğer abonelere haber verilir
        this.loadCurrentUser();
        this.router.navigate(['/']);
      })
    );
  }
  googleLogin(payload: { idToken: string }) {
    return this.http.post(`${this.apiUrl}/google-login`, payload);
  }

  googleRegister(payload: { idToken: string }) {
    return this.http.post(`${this.apiUrl}/google-register`, payload);
  }

  register(userDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userDto).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      })
    );
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
    return !!this.storageService.getToken();
  }

  getToken(): string | null {
    return this.sessionService.getToken();
  }

  getUserRole(): string[] | null {
    return this.getUserRoles();
  }

  getUserRoles(): string[] {
    const role = this.sessionService.get<string | string[]>('role');
    if (!role) return [];
    return Array.isArray(role) ? role : [role]; // Tek stringse array'e çevir
  }





  getPrimaryRole(): string | null {
    const roles = this.getUserRoles();
    return roles.length > 0 ? roles[0] : null;
  }








  getCurrentUserFromApi(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  public loadCurrentUser(): void {
    const user = this.storageService.get<User>('user');
    if (user) {
      this.currentUserSubject.next(user);
    }
  }


  getUserId(): number | null {
    return this.currentUserSubject.getValue()?.id || null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }
}
