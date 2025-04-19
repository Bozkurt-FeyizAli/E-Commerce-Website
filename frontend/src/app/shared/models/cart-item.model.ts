import { Product } from './product.model';
export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  // İlişkiler
  product: Product;
}
