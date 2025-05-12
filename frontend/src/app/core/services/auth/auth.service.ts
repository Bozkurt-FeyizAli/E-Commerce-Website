// import { StorageService } from './../storage/storage.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
//import { SessionService } from 'app/core/services/session/session.service';
import { User } from '../../../shared/models/user';
import { get } from 'http';
import { Router } from '@angular/router';
import { TokenStorageService } from '../token-storage/token-storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {



  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient,  private tokenStore: TokenStorageService, private router: Router) {
    /* 1) Uygulama başlarken token+user çek */
    const storedUser  = this.tokenStore.getUser();
    const storedToken = this.tokenStore.getToken();

    if (storedToken) {
      if (storedUser) {
        // API beklemeden hemen subject'e bas
        this.currentUserSubject.next(storedUser);
      } else {
        // Kullanıcı yoksa /me çağrısıyla doldur (isteğe bağlı)
        this.getCurrentUserFromApi().subscribe({
          next: u => { this.currentUserSubject.next(u); this.tokenStore.saveUser(u); },
          error: () => this.tokenStore.clear()
        });
      }
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

        // 🔥 Rol nesnelerini string array'e çevir
        const roleNames = user.roles.map((r: any) => `ROLE_${r.name?.toUpperCase?.()}`);

        // 🔥 Yeni user objesi (tip kontrolüne takılmamak için `as any`)
        const updatedUser = { ...user, roles: roleNames } as any;

        this.tokenStore.saveToken(response.accessToken);
        this.tokenStore.saveUser(updatedUser);
        this.currentUserSubject.next(updatedUser);

        console.log('✅ Kaydedilen kullanıcı:', updatedUser);


        // Rol bazlı yönlendirme
        if (roleNames.includes('ROLE_SELLER')) {
          this.router.navigate(['/seller']);
        } else {
          this.router.navigate(['/home']);
        }
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
        this.router.navigate(['/auth/login']);
      })
    );
  }

  logout(): void {
    this.tokenStore.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.tokenStore.getToken();
  }

  getToken(): string | null {
    return this.tokenStore.getToken();
  }

  getUserRole(): string[] | null {
    return this.getUserRoles();
  }

  getUserRoles(): string[] {
    const user = this.tokenStore.getUser();
    if (!user || !Array.isArray(user.roles)) return [];

    // Eğer rol zaten string olarak kayıtlıysa
    if (typeof user.roles[0] === 'string') return user.roles;

    // 🔁 Object[] ise dönüştür
    return user.roles.map((r: any) => `ROLE_${r.name?.toUpperCase?.()}`);
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
    const user = this.tokenStore.getUser();
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

  saveUser(user: User) {
    this.tokenStore.saveUser(user);
    this.currentUserSubject.next(user);
  }
  saveToken(accessToken: any) {
    this.tokenStore.saveToken(accessToken);
  }
}
