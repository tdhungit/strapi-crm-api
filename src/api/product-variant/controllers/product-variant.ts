import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::product-variant.product-variant',
  ({ strapi }) => ({
    async getPrice(ctx) {
      const { id } = ctx.params;
      const { date } = ctx.request.query;

      if (!date) {
        ctx.throw(400, 'Date query parameter is required');
      }

      if (isNaN(Date.parse(date as string))) {
        ctx.throw(400, 'Invalid date format');
      }

      if (!id) {
        ctx.throw(400, 'Product variant ID is required');
      }

      const price = await strapi
        .service('api::product-variant.product-variant')
        .getPrice(id, new Date(date as string));

      ctx.body = { price };
    },
  })
);
