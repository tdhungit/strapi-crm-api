import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::product-variant.product-variant',
  ({ strapi }) => ({
    async getPrice(variantId: number, date: Date, priceType?: string) {
      const andWere: any = {};

      if (priceType) {
        andWere['price_type'] = priceType;
      }

      const price = await strapi.db
        .query('api::product-price.product-price')
        .findOne({
          where: {
            product_variant: {
              id: variantId,
            },
            price_status: 'Active',
            $and: [
              {
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
              },
            ],
            ...andWere,
          },
          orderBy: { start_date: 'DESC' },
        });

      return price ? { ...price } : {};
    },
  })
);
