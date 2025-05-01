import { Product } from './product';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;

  product?: Product;
}
