import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::purchase-order-detail.purchase-order-detail',
  ({ strapi }) => ({
    async create(ctx) {
      return ctx.badRequest('Not allowed to create PO detail directly');
    },

    async update(ctx) {
      return ctx.badRequest('Not allowed to update PO detail directly');
    },

    async delete(ctx) {
      return ctx.badRequest('Not allowed to delete PO detail directly');
    },
  })
);
