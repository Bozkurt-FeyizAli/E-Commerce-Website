
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'auth-token';
const USER_KEY  = 'auth-user';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  saveToken(token: string)     { if (this.isBrowser) localStorage.setItem(TOKEN_KEY, token); }
  getToken(): string | null {
    if (this.isBrowser) {
      return window.localStorage.getItem('auth-token');
    }
    return null;
  }


  saveUser(user: any)          { if (this.isBrowser) localStorage.setItem(USER_KEY, JSON.stringify(user)); }
  getUser(): any               { return this.isBrowser ? JSON.parse(localStorage.getItem(USER_KEY) || 'null') : null; }

  clear()                      { if (this.isBrowser) { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); } }
}
