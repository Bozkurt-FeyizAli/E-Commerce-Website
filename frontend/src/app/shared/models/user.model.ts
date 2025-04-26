import { Order } from './order.model';
import { Cart } from './cart.model';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  passwordHash?: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: Date;
  orders?: Order[];
  cart?: Cart;
}

