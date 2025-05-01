import { ProductImage } from '@model/product-image';
import { AdminService } from './../service/admin.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '@model/product';
import { Category } from '@model/category';

@Component({
  selector: 'app-manage-products',
  standalone: false,
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  newProduct: Product = {
    id: 0,
    name: '',
    price: 0,
    stock: 0,
    description: '',
    isActive: false,
    createdAt: new Date(),
    category: {
      id: 0,
      name: '',
      description: ''
    }
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.adminService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch products', err);
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  addProduct() {
    if (!this.newProduct.name || !this.newProduct.price) {
      alert('Name and price are required.');
      return;
    }
    this.adminService.createProduct(this.newProduct).subscribe({
      next: (product) => {
        this.products.push(product);
        this.newProduct = {
          id: 0,
          name: '',
          price: 0,
          stock: 0,
          description: '',
          isActive: false,
          createdAt: new Date(),
          category: {
            id: 0,
            name: '',
            description: ''
          }
        };
      },
      error: (err) => {
        console.error('Failed to create product', err);
      }
    });
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== productId);
        },
        error: (err) => {
          console.error('Failed to delete product', err);
        }
      });
    }
  }
}
