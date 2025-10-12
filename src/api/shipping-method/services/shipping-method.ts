import { factories } from '@strapi/strapi';
import { AddressType } from './../../address/types';
import { CouponType } from './../../coupon/types';
import { ShippingAmountType, ShippingMethodType } from './../types';

export default factories.createCoreService(
  'api::shipping-method.shipping-method',
  ({ strapi }) => ({
    async getShippingAmount(
      shippingAddress: AddressType,
      shippingMethod: ShippingMethodType,
      coupons?: CouponType[],
    ): Promise<ShippingAmountType> {
      // @TODO: Implement real shipping calculation
      const fixedAmount = 20;
      const amount: ShippingAmountType = {
        subtotal: fixedAmount,
        discount_type: 'percentage',
        discount: 0,
        total: fixedAmount,
        couponId: null,
      };

      if (coupons && coupons.length > 0) {
        const shippingCoupon: CouponType = coupons.find(
          (c) => c.coupon_type === 'Shipping',
        );
        if (shippingCoupon) {
          amount.couponId = shippingCoupon.id;
          if (shippingCoupon.discount_type === 'percentage') {
            amount.discount +=
              amount.subtotal * (shippingCoupon.discount_value / 100);
          } else {
            amount.discount += shippingCoupon.discount_value;
          }
        }
      }

      amount.total = amount.subtotal - amount.discount;
      return amount;
    },
  }),
);
