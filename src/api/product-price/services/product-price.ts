import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::product-price.product-price',
  ({ strapi }) => ({
    filterPriceFromDate(date: Date) {
      return {
        $or: [
          {
            start_date: null,
            end_date: null,
          },
          {
            start_date: { $lte: date.toISOString() },
            end_date: { $gte: date.toISOString() },
          },
          {
            start_date: { $lte: date.toISOString() },
            end_date: null,
          },
          {
            start_date: null,
            end_date: { $gte: date.toISOString() },
          },
        ],
      };
    },
  })
);
