import { factories } from '@strapi/strapi';
import { CartType } from './../../cart/types';
import { CouponType } from './../types';

export default factories.createCoreService(
  'api::coupon.coupon',
  ({ strapi }) => ({
    async getAvailableCoupons(params: any = {}) {
      const coupons = await strapi.entityService.findMany(
        'api::coupon.coupon',
        {
          filters: {
            coupon_status: 'Active',
            $and: [
              {
                $or: [
                  {
                    limited: {
                      $eq: 0,
                    },
                  },
                  {
                    limited: {
                      $lt: 1,
                    },
                  },
                ],
              },
              {
                $or: [
                  {
                    start_date: {
                      $lte: new Date(),
                    },
                  },
                  {
                    start_date: null,
                  },
                ],
              },
              {
                $or: [
                  {
                    end_date: {
                      $gte: new Date(),
                    },
                  },
                  {
                    end_date: null,
                  },
                ],
              },
            ],
          },
        },
      );
      return coupons;
    },

    calcDiscount(subtotal: number, coupon: CouponType, params?: any) {
      params = params || {};
      let discount = coupon.discount_value || 0;
      if (coupon.discount_type === 'percentage') {
        discount = subtotal * (discount / 100);
      }
      return discount;
    },

    async isValidCoupon(coupon: CouponType, cart: CartType) {
      if (coupon.limited && coupon.used >= coupon.limited) {
        return false;
      }

      if (coupon.min_order_amount && cart.subtotal < coupon.min_order_amount) {
        return false;
      }

      if (coupon.product_categories && coupon.product_categories.length > 0) {
        // @TODO: check product categories
      }

      return true;
    },

    async isValidCoupons(coupons: CouponType[], cart: CartType) {
      for await (const coupon of coupons) {
        if (!(await this.isValidCoupon(coupon, cart))) {
          return false;
        }
      }
      return true;
    },
  }),
);
