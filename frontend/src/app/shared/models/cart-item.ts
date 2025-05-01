import { Product } from './product';

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  priceWhenAdded: number; // DB'ye göre değiştirildi
  product?: Product;
  isActive: boolean; // camelCase'e dönüştü
}
