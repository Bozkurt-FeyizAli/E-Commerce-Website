import { User } from './user.model';
import { CartItem } from './cart-item.model';
export interface Cart {
  id: number;
  userId: number;
  // İlişkiler
  user: User;
  items: CartItem[];
}
