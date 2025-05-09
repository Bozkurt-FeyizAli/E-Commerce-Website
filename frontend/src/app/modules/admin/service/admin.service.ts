import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '@model/order';
import { Category } from '@model/category';
import { Product } from '@model/product';
import { environment } from '@env/environment';
import { User } from '@model/user';
import { Complaint } from '@model/complaint';
import { Activity } from '@model/activity';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Dashboard Statistics
  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/dashboard`);
  }

  // // Recent Activities
  // getRecentActivities(): Observable<Activity[]> {
  //   return this.http.get<Activity[]>(`${this.apiUrl}/recent-activities`);
  // }

  // User Management
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  banUser(userId: number, newStatus: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/ban-user/${userId}`, null);
  }

  unbanUser(userId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/unban-user/${userId}`, null);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  // Product Management
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(productId: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${productId}`, product);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}`);
  }

  // Category Management
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(categoryId: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${categoryId}`, category);
  }

  deleteCategory(categoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${categoryId}`);
  }

  // Complaint Management
  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/complaints`);
  }

  updateComplaintStatus(complaintId: number, status: string, resolutionComment: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/complaints/${complaintId}`, {
      status,
      resolutionComment
    });
  }

  // Sales Analytics
  getSalesStatsLast7Days(): Observable<SalesStatsDto[]> {
    return this.http.get<SalesStatsDto[]>(`${this.apiUrl}/sales-stats`);
  }


  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${orderId}/status?status=${status}`, {});
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${orderId}`);
  }


}

// Interface updates
export interface AdminStats {
  salesStats: any;
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  openComplaints: number;
  totalRevenue: number;
  topProducts: TopProduct[];
  recentOrders?: Order[];
  lowStockProducts?: Product[];
}

interface TopProduct {
  productId: number;
  productName: string;
  totalSold: number;
  revenue: number;
}

interface SalesStatsDto {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}
