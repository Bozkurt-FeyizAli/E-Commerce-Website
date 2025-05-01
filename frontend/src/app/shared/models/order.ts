import { User } from './user';
import { OrderItem } from './order-item';
import { OrderStatus } from './order-status';

export interface Order {
  id: number;
  userId: number;
  paymentId?: number;
  totalAmount: number;
  status: OrderStatus;
  shippingAddressLine: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  orderDate: Date;
  orderItems?: OrderItem[];
  user?: User;
}



