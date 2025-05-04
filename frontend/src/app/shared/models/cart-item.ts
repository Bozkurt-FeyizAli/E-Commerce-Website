import { Product } from './product';

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  priceWhenAdded: number;
  isActive: boolean;
  product: Product;
}

