import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Product } from '@model/product';
import { CloudinaryService } from 'app/core/services/cloudinary/cloudinary.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  productForm!: FormGroup;
  isImageUploading = false;


  constructor(
    private sellerService: SellerService,
    private cloudinary: CloudinaryService,
    private fb: FormBuilder
  ) {}


ngOnInit(): void {
  this.productForm = this.fb.group({
    name: [''],
    description: [''],
    price: [''],
    stock: [''],
    image: [null]
  });
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isImageUploading = true;
      this.cloudinary.uploadImage(file).subscribe({
        next: (res) => {
          this.productForm.patchValue({ mainImageUrl: res.secure_url });
          this.isImageUploading = false;
        },
        error: () => {
          alert('Görsel yüklenirken hata oluştu.');
          this.isImageUploading = false;
        }
      });
    }
  }

  submitProduct(): void {
    const product = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      stock: this.productForm.value.stock,
      mainImageUrl: this.productForm.value.image
    };

    console.log('Gönderilen ürün:', product); // ➤ Burası mainImageUrl null mı?

    this.sellerService.addProduct(product as any).subscribe(() => {
      alert('Ürün başarıyla eklendi');
      this.fetchProducts();
      this.productForm.reset();
    });
  }
}
