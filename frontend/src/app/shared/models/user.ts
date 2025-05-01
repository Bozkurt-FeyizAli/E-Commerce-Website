import { Order } from './order';
import { Cart } from './cart';
import { Role } from './role.enum';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
  password?: string; // passwordHash yerine password
  roles: Role[]; // array olarak (gelişmiş yapı)
  isBanned: boolean;
  isActive: boolean;
  createdAt: Date;
  orders?: Order[];
  cart?: Cart;
}
