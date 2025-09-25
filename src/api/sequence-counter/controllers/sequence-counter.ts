import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::sequence-counter.sequence-counter',
  ({ strapi }) => ({
    async create(ctx) {
      return ctx.badRequest('Not allowed to create sequence counter directly');
    },

    async update(ctx) {
      return ctx.badRequest('Not allowed to update sequence counter directly');
    },

    async delete(ctx) {
      return ctx.badRequest('Not allowed to delete sequence counter directly');
    },
  })
);
