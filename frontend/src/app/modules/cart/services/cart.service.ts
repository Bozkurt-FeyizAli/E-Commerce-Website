import { Injectable } from '@angular/core';
import { Product } from '../../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }
  addItem(product: Product){}
}
