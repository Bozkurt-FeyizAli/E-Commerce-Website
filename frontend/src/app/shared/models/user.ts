import { Order } from './order';
import { Cart } from './cart';
import { Role } from './role';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImageUrl: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
  password?: string; // passwordHash yerine password
  roles: Role[];
  isBanned: boolean;
  isActive: boolean;
  orders?: Order[];
  cart?: Cart;
}
