import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::inventory.inventory',
  ({ strapi }) => ({
    async create(ctx) {
      return ctx.badRequest(
        'Inventory creation is disabled via this endpoint.'
      );
    },

    async update(ctx) {
      return ctx.badRequest('Inventory update is disabled via this endpoint.');
    },

    async delete(ctx) {
      return ctx.badRequest(
        'Inventory deletion is disabled via this endpoint.'
      );
    },
  })
);
