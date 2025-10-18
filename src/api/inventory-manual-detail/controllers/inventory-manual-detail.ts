import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController(
  'api::inventory-manual-detail.inventory-manual-detail',
  ({ strapi }) => ({
    async create(ctx: Context) {
      return ctx.badRequest(
        'Inventory Manual Detail creation is disabled via this endpoint.',
      );
    },

    async update(ctx: Context) {
      return ctx.badRequest(
        'Inventory Manual Detail update is disabled via this endpoint.',
      );
    },

    async delete(ctx: Context) {
      return ctx.badRequest(
        'Inventory Manual Detail deletion is disabled via this endpoint.',
      );
    },
  }),
);
