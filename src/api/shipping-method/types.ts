export interface ShippingMethodType {
  id?: number;
  documentId?: string;
  name: string;
  description?: string;
  options?: any;
}

export interface ShippingAmountType {
  subtotal: number;
  discount_type: string;
  discount: number;
  total: number;
  couponId?: number;
  transactionId?: string;
}
