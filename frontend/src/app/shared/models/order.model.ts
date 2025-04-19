import { User } from './user.model';
import { OrderItem } from './order-item.model';
export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
  createdAt: Date;
  // İlişkiler
  user: User;
  items: OrderItem[];
}
