// product-list.component.ts
import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../../cart/services/cart.service';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: Product[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (ps:Product[]) => {
        this.products=ps;
      }
    )
    this.products.forEach(product => {
      console.log(product.id, product.name, product.price);
    });
  }

  addToCart(product: Product) {
    this.cartService.addItem(product);
  }
}
