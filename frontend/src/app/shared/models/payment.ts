export interface Payment {
  id: number;
  userId: number; // eklendi (backend'de var)
  amount: number;
  transactionReference: string; // backend ismiyle uyumlu hale geldi
  status: 'SUCCESS' | 'FAILED' | 'PENDING'; // PENDING backend'de vardı
  paymentDate: Date; // backend: payment_date
  paymentFormatId: number;
}
