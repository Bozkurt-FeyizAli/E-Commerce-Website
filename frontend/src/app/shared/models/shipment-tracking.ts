export interface ShipmentTracking {
  id: number;
  orderId: number;
  trackingNumber: string;
  shipmentStatus: 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED';
  carrier: string;
  estimatedDeliveryDate?: Date;
  deliveredDate?: Date;
  isActive: boolean;
}
