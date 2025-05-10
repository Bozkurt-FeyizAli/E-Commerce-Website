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
    image: [null],
    mainImageUrl: [''] // ✅ Bu eklenirse yukarıdaki kod doğru olur
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
    if (!file) return;

    this.isImageUploading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Preset adın buysa

    fetch('https://api.cloudinary.com/v1_1/dqhw1xmyf/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Cloudinary yükleme hatası: ' + res.statusText);
        }
        return res.json();
      })
      .then(data => {
        this.productForm.patchValue({ mainImageUrl: data.secure_url });
        console.log('📷 Görsel URL:', data.secure_url);
        this.isImageUploading = false;
      })
      .catch(err => {
        console.error('❌ Yükleme hatası:', err);
        alert('Görsel yüklenemedi. Lütfen tekrar deneyin.');
        this.isImageUploading = false;
      });
  }



  submitProduct(): void {
    const userId = 5; // örnek sellerId (oturum açmış kullanıcıdan alınmalı)
    const categoryId = 1; // örnek categoryId (formdan seçilmesi önerilir)

    const product = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      stock: this.productForm.value.stock,
      mainImageUrl: this.productForm.value.mainImageUrl, // ✅ Doğru alan
      sellerId: userId,
      categoryId: categoryId
    };

    this.sellerService.addProduct(product as any).subscribe(() => {
      alert('Ürün başarıyla eklendi');
      this.fetchProducts();
      this.productForm.reset();
    });
  }


}
