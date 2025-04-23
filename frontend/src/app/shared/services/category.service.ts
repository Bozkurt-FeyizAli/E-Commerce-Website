import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '@models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesUrl = 'http://localhost:3000/category';

  constructor(private http: HttpClient) {}

  getMainCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }
}
