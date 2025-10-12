export interface CartDetailType {
  product_variant: any;
  quantity: number;
  price: number;
  discount_type?: string;
  discount_amount?: number;
  tax_type?: string;
  tax_amount?: number;
  subtotal: number;
}

export interface CartType {
  id?: number;
  documentId?: string;
  contact: any;
  cart_details: CartDetailType[];
  subtotal: number;
  discount_type?: string;
  discount_amount?: number;
  tax_type?: string;
  tax_amount?: number;
}
