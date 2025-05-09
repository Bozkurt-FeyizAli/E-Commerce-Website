import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
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
}

