import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::sale-order-detail.sale-order-detail',
  ({ strapi }) => ({
    async create(ctx) {
      return ctx.badRequest('Not allowed to create SO detail directly');
    },

    async update(ctx) {
      return ctx.badRequest('Not allowed to update SO detail directly');
    },

    async delete(ctx) {
      return ctx.badRequest('Not allowed to delete SO detail directly');
    },
  })
);
