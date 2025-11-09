import { factories } from '@strapi/strapi';
import dayjs from 'dayjs';

export default factories.createCoreService(
  'api::product-price.product-price',
  ({ strapi }) => ({
    filterPriceFromDate(date: Date) {
      const dateStr = dayjs(date).format('YYYY-MM-DD');
      return {
        $or: [
          {
            start_date: null,
            end_date: null,
          },
          {
            start_date: { $lte: dateStr },
            end_date: { $gte: dateStr },
          },
          {
            start_date: { $lte: dateStr },
            end_date: null,
          },
          {
            start_date: null,
            end_date: { $gte: dateStr },
          },
        ],
      };
    },
  }),
);
