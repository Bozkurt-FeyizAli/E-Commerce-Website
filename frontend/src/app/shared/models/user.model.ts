import { Order } from './order.model';
import { Cart } from './cart.model';

export interface User {
  id: number;
  email: string;
  passwordHash?: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: Date;
  orders?: Order[];
  cart?: Cart;
}

