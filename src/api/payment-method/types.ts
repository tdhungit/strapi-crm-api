export interface PaymentMethodType {
  id?: number;
  documentId?: string;
  name: string;
  enabled: boolean;
  description?: string;
  options?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentType {
  id?: number;
  documentId?: string;
  sale_order: number;
  amount: number;
  payment_method: any;
  payment_status?: string;
  payment_date?: Date;
  transaction_id?: string;
}
