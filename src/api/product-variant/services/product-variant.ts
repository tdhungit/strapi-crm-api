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
              strapi
                .service('api::product-price.product-price')
                .filterPriceFromDate(date),
            ],
            ...andWere,
          },
          orderBy: { start_date: 'DESC' },
        });

      return price ? { ...price } : {};
    },
  })
);
