import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  save(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`Saved to localStorage: ${key} = ${value}`);
  }

  get<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  saveToken(token: string): void {
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
    localStorage.removeItem('token');
  }
}
