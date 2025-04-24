export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  transactionId: string;
  status: 'SUCCESS' | 'FAILED';
  createdAt: Date;
}
