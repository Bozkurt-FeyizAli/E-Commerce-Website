import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Product } from '@model/product';

@Component({
  selector: 'app-product-management',
  standalone: false,
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.sellerService.getMyProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Ürünler yüklenirken hata oluştu.';
        this.isLoading = false;
      }
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      this.sellerService.deleteProduct(productId).subscribe(() => {
        this.fetchProducts();  // Yeniden yükle
      });
    }
  }
}
