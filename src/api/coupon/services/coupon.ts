import { factories } from '@strapi/strapi';

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
  }),
);
