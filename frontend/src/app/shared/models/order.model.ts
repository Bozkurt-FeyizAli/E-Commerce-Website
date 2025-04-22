import { User } from './user.model';
import { OrderItem } from './order-item.model';
export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
}

export type OrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED';
