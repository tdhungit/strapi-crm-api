export interface CouponType {
  id?: number;
  documentId?: string;
  name: string;
  description?: string;
  coupon_type: string;
  coupon_status: string;
  limited?: number;
  used?: number;
  start_date?: Date;
  end_date?: Date;
  discount_type?: string;
  discount_value?: number;
  amount?: number;
}
