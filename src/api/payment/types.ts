export interface PaymentType {
  id?: number;
  documentId?: string;
  sale_order: any;
  amount: number;
  payment_method: string;
  payment_date: Date;
  payment_status: string;
  transaction_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  invoices?: any[];
}
