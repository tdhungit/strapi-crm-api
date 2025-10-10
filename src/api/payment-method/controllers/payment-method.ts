import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::payment-method.payment-method',
  ({ strapi }) => ({
    async findByName(ctx) {
      const { name } = ctx.params;

      const method = await strapi.db
        .query('api::payment-method.payment-method')
        .findOne({ where: { name } });

      if (!method) {
        return ctx.throw(400, 'Payment method not found');
      }

      let options = {};

      if (name === 'stripe') {
        options = {
          testMode: method.options?.testMode || false,
          apiKey: method.options?.apiKey || '',
          testApiKey: method.options?.testApiKey || '',
        };
      }

      return {
        id: method.id,
        documentId: method.documentId,
        name: method.name,
        description: method.description,
        enabled: method.enabled,
        options,
      };
    },

    async find(ctx) {
      const methods = await strapi.db
        .query('api::payment-method.payment-method')
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

      const entity = await strapi.db
        .query('api::payment-method.payment-method')
        .findOne({ where: { id } });

      delete entity.options;

      return {
        data: entity,
        meta: {},
      };
    },
  }),
);
