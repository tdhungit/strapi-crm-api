export interface SaleOrderSaveType {
  id?: number;
  documentId?: string;
  name?: string;
  account?: number;
  contact?: number;
  warehouse?: number;
  sale_date?: string;
  order_status?: string;
  subtotal?: number;
  discount_amount?: number;
  discount_type?: string;
  tax_amount?: number;
  tax_type?: string;
  total_amount?: number;
  assigned_user?: number;
  items?: SaleOrderDetailSaveType[];
}

export interface SaleOrderDetailSaveType {
  id?: number;
  documentId?: string;
  sale_order?: number;
  product_variant?: number;
  warehouse?: number;
  quantity?: number;
  unit_price?: number;
  discount_amount?: number;
  discount_type?: string;
  tax_amount?: number;
  tax_type?: string;
  subtotal?: number;
}

export interface SaleOrderSaveOptions {
  auth?: any;
  status?: string;
  user?: any;
  [key: string]: any;
}
