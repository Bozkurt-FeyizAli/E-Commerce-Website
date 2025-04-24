import { OrderItem } from './order-item.model';

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  orderItems?: OrderItem[];
}

export type OrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED';
