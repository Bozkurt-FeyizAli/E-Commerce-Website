import { User } from './user.model';
import { OrderItem } from './order-item.model';
import { OrderStatus } from './order-status.model';

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  tracingId?: string;
  rating?: number;
  comment?: string;
  paymentMethodId?: number;
  orderItems?: OrderItem[];
  user?: User;
}



