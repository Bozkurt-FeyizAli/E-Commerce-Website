
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '@model/order';
import { Category } from '@model/category';
import { Product } from '@model/product';
import { environment } from '@env/environment';
import { User } from '@model/user'; // Model path’in seninkine göre değişebilir
import { Complaint } from '@model/complaint';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getRecentOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/recent-orders`);
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock-products`);
  }

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }


// Kullanıcıları getir
getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/users`);
}

// Banla veya aç (toggle gibi)
banUser(userId: number, ban: boolean): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/users/${userId}/ban`, { isBanned: ban });
}

// Sil
deleteUser(userId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
}


// Tüm ürünleri getir
getAllProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/products`);
}

// Yeni ürün ekle
createProduct(product: Product): Observable<Product> {
  return this.http.post<Product>(`${this.apiUrl}/products`, product);
}

// Ürün güncelle
updateProduct(productId: number, product: Product): Observable<Product> {
  return this.http.put<Product>(`${this.apiUrl}/products/${productId}`, product);
}

// Ürün sil
deleteProduct(productId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/products/${productId}`);
}

// Tüm kategorileri getir
getAllCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(`${this.apiUrl}/categories`);
}

// Yeni kategori ekle
createCategory(category: Category): Observable<Category> {
  return this.http.post<Category>(`${this.apiUrl}/categories`, category);
}

// Kategori güncelle
updateCategory(categoryId: number, category: Category): Observable<Category> {
  return this.http.put<Category>(`${this.apiUrl}/categories/${categoryId}`, category);
}

// Kategori sil
deleteCategory(categoryId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/categories/${categoryId}`);
}

// Tüm siparişleri getir
getAllOrders(): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.apiUrl}/orders`);
}

// Sipariş durumu güncelle
updateOrderStatus(orderId: number, status: string): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/orders/${orderId}/status`, { status });
}

getAllComplaints(): Observable<Complaint[]> {
  return this.http.get<Complaint[]>(`${this.apiUrl}/complaints`);
}

// Şikayet durumu + çözüm güncelle
updateComplaintStatus(complaintId: number, status: string, resolutionComment: string): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/complaints/${complaintId}/status`, {
    status,
    resolutionComment
  });
}
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  topProducts?: {
    productName: string;
    totalSold: number;
  }[];
}
