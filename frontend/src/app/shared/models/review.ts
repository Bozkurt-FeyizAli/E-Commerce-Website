export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    username: string;
    avatarUrl?: string;
  };
}
