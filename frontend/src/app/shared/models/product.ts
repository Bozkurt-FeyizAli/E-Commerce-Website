import { CartItem } from './cart-item';
import { OrderItem } from './order-item';
import { Category } from './category';

export interface Product {
title: any;
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  mainImageUrl?: string; // backend ismine göre
  discountPercentage?: number;
  ratingAverage?: number;
  productDetails?: string;
  isActive: boolean;
  createdAt: Date;
  category: Category;
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
}


