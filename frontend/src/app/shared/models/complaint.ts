export interface Complaint {
  id: number;
  userId: number;
  orderId: number;
  complaintType: string;
  description: string;
  createdAt: Date;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolutionComment?: string;
  isActive: boolean;
}
