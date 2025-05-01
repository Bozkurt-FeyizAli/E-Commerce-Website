import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // Save a value to sessionStorage
  save(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  // Get a value from sessionStorage
  get<T>(key: string): T | null {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  }

  // Remove a specific key
  remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Clear the entire sessionStorage
  clear(): void {
    sessionStorage.clear();
  }

  // Special method to save token
  saveToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  // Special method to get token
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Special method to remove token
  removeToken(): void {
    sessionStorage.removeItem('token');
  }
}
