import { Injectable } from '@angular/core';
import { ProductService } from 'app/modules/products/services/product.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private productService: ProductService) {}

  getFeaturedProducts() {
    return this.productService.getFeaturedProducts();
  }
}
