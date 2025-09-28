import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::sale-order.sale-order',
  ({ strapi }) => ({
    async create(ctx) {
      const { data } = ctx.request.body;

      const entry = await strapi
        .service('api::sale-order.sale-order')
        .createOrder(data, {
          auth: ctx.state.auth,
          user: ctx.state.user,
          status: 'New',
        });

      return this.transformResponse(entry);
    },

    async update(ctx) {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      const existingEntry = await strapi.db
        .query('api::sale-order.sale-order')
        .findOne({ where: { documentId: id } });

      if (!existingEntry) {
        return ctx.notFound('Sale Order not found');
      }

      const entry = await strapi
        .service('api::sale-order.sale-order')
        .updateOrder(existingEntry, data, {
          auth: ctx.state.auth,
          user: ctx.state.user,
        });

      return this.transformResponse(entry);
    },

    async changeStatus(ctx) {
      const { id } = ctx.params;
      const { status } = ctx.request.body;

      const existingEntry = await strapi.db
        .query('api::sale-order.sale-order')
        .findOne({ where: { documentId: id } });

      if (!existingEntry) {
        return ctx.notFound('Sale Order not found');
      }

      const entry = await strapi
        .service('api::sale-order.sale-order')
        .changeOrderStatus(existingEntry, status, {
          auth: ctx.state.auth,
          user: ctx.state.user,
        });

      return this.transformResponse(entry);
    },
  })
);
