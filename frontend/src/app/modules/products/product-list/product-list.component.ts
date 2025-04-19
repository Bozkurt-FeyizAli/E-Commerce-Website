import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../../cart/services/cart.service';
import { Product } from '../../../shared/models/product.model'; // Adjust the import path as necessary

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  addToCart(product: Product) {
    this.cartService.addItem(product);
  }
}
