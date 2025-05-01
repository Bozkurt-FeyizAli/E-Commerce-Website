import { CartItem } from './cart-item';

export interface Cart {
  id: number;
  userId: number;
  createdAt: Date; // eklendi
  updatedAt: Date; // eklendi
  items: CartItem[];
  isActive: boolean; // camelCase
}
