import { Component } from '@angular/core';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: { product: Product; quantity: number }[] = [];
}
