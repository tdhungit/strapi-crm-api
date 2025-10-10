import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::shipping-method.shipping-method',
  ({ strapi }) => ({
    async find(ctx) {
      const methods = await strapi.db
        .query('api::shipping-method.shipping-method')
        .findMany({});

      return methods.map((method) => ({
        id: method.id,
        documentId: method.documentId,
        name: method.name,
        description: method.description,
        enabled: method.enabled,
      }));
    },

    async findOne(ctx) {
      const { id } = ctx.params;
      const method = await strapi.db
        .query('api::shipping-method.shipping-method')
        .findOne({
          where: { id },
        });

      if (!method) {
        return ctx.notFound('Shipping method not found');
      }

      return {
        id: method.id,
        documentId: method.documentId,
        name: method.name,
        description: method.description,
        enabled: method.enabled,
      };
    },

    async findByName(ctx) {
      const { name } = ctx.params;
      const method = await strapi.db
        .query('api::shipping-method.shipping-method')
        .findOne({
          where: { name },
        });

      if (!method) {
        return ctx.notFound('Shipping method not found');
      }

      return {
        id: method.id,
        documentId: method.documentId,
        name: method.name,
        description: method.description,
        enabled: method.enabled,
      };
    },
  }),
);
