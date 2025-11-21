import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController(
  'api::dashboard-item.dashboard-item',
  ({ strapi }) => ({
    async getItemData(ctx: Context) {
      const { id } = ctx.params;
      const item = await strapi.db
        .query('api::dashboard-item.dashboard-item')
        .findOne({
          where: {
            id,
          },
        });

      if (!item) {
        return ctx.notFound('Item not found');
      }

      if (item.type === 'Query') {
        const result = await strapi
          .service('api::dashboard-item.dashboard-item')
          .getQueryResult(item);

        const fields = result.fields.map((field: any) => ({
          name: field.name,
          type: field.format,
        }));

        return {
          data: result.rows,
          meta: {
            ...item.metadata,
            total: result.rowCount,
            fields,
          },
        };
      }

      if (item.type === 'Builder') {
        return await strapi
          .service('api::dashboard-item.dashboard-item')
          .getFilterBuilderResult(item);
      }

      return ctx.badRequest('Invalid item type');
    },
  }),
);
