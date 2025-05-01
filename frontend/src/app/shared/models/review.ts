export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number; // 1 to 5
  comment?: string;
  reviewDate: Date;
  isActive: boolean;
}
