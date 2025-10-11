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
      // @TODO
      return {
        subtotal: 20,
        discount_type: 'percentage',
        discount: 0,
        total: 20,
        couponId: null,
      };
    },
  }),
);
