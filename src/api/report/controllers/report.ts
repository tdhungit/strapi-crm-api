import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController(
  'api::report.report',
  ({ strapi }) => ({
    async generateReport(ctx: Context) {
      const { query, filters, module } = ctx.request.body;
      return await strapi
        .service('api::report.report')
        .generateReport(module, filters, query);
    },
  }),
);
