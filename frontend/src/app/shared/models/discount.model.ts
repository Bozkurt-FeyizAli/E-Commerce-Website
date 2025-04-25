export interface Discount {
  id: number;
  productId: number;
  bannerId: number;
  isPercent: boolean;
  value: number;
  isActive: boolean;
}
