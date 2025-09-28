export interface InvoiceDetailType {
  id?: string;
  documentId?: string;
  invoice: any;
  name: string;
  quantity: number;
  unit_price: number;
  discount_amount?: number;
  tax_amount?: number;
  subtotal: number;
  product_variant?: any;
}

export interface InvoiceType {
  id?: string;
  documentId?: string;
  sale_order: any;
  payment: any;
  invoice_status: 'Paid' | 'Unpaid';
  invoice_date: Date;
  due_date: Date;
  subtotal: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  invoice_tax_amount?: number;
  account_tax?: any;
  description?: string;
  invoice_details?: InvoiceDetailType[];
}
