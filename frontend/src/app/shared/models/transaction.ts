export type TransactionType = 'PAYMENT' | 'REFUND' | 'PARTIAL_REFUND';
export type TransactionStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface Transaction {
  id: number;
  paymentId: number;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  transactionAmount: number;
  transactionDate: Date;
  gatewayResponse?: string;
  isActive: boolean;
}
