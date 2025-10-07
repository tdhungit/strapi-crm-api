import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::payment-method.payment-method',
  ({ strapi }) => ({
    async findByName(ctx) {
      const { name } = ctx.params;

      const entity = await strapi.db
        .query('api::payment-method.payment-method')
        .findOne({ where: { name } });

      return entity;
    },
  }),
);
