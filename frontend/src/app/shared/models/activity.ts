export interface Activity {
  id: number;
  type: ActivityType;
  description: string;
  user: string; // Could also be User object if you want more details
  timestamp: Date;
  relatedEntityId?: number; // ID of related product/order/etc
}

export type ActivityType =
  | 'USER_REGISTERED'
  | 'PRODUCT_ADDED'
  | 'ORDER_COMPLETED'
  | 'COMPLAINT_FILED'
  | 'PRODUCT_UPDATED'
  | 'USER_BANNED';
