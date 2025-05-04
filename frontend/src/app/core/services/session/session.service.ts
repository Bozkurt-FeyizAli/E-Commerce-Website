import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  save(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`Saved to localStorage: ${key} = ${value}`);
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  }

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }

  saveToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    console.log(`Token saved to localStorage: ${token}`);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('token');
  }

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  }
}
