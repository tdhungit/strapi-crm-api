import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::product-variant.product-variant',
  ({ strapi }) => ({
    async getPrice(variantId: number, date: Date) {
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
                start_date: { $lte: date.toISOString() },
                $or: [
                  { end_date: null },
                  { end_date: { $gte: date.toISOString() } },
                ],
              },
            ],
          },
          orderBy: { start_date: 'DESC' },
        });

      return price ? { ...price } : {};
    },
  })
);
