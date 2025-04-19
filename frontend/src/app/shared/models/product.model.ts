import { CartItem } from './cart-item.model';
import { OrderItem } from './order-item.model';
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  imageUrl: string;
  // İlişkiler
  cartItems: CartItem[];
  orderItems: OrderItem[];
}
