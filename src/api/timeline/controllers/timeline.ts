import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::timeline.timeline',
  ({ strapi }) => ({
    async create(ctx) {
      return ctx.badRequest('Timeline entries cannot be created via the API');
    },

    async update(ctx) {
      return ctx.badRequest('Timeline entries cannot be updated via the API');
    },

    async delete(ctx) {
      return ctx.badRequest('Timeline entries cannot be deleted via the API');
    },
  })
);
