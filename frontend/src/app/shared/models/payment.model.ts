interface Payment {
  id: number;
  orderId: number;
  amount: number;
  transactionId: string; // Stripe/PayPal transaction ID
  status: 'SUCCESS' | 'FAILED';
  createdAt: Date;
}
