import { CartItem } from './cart-item.model';
import { OrderItem } from './order-item.model';
import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  imageUrl?: string;
  featured?: boolean;
  active?: boolean;
  productDetails?: string;

  category: Category;

  // İlişkiler
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
}
