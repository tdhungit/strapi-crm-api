import { factories } from '@strapi/strapi';
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
  }),
);
