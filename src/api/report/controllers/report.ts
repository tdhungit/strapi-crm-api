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

    async getReportResult(ctx: Context) {
      const { id } = ctx.params;

      const page = ctx.query.current || 1;
      const pageSize = ctx.query.pageSize || 20;

      const report = await strapi.db.query('api::report.report').findOne({
        where: {
          id,
        },
      });

      if (!report) {
        return ctx.notFound('Report not found');
      }

      const { module, filters, query } = report.metadata || {};
      if (!module) {
        return ctx.badRequest('Invalid report metadata');
      }

      return await strapi
        .service('api::report.report')
        .generateReport(module, filters, query, {
          page,
          pageSize,
        });
    },

    async isValidQuery(ctx: Context) {
      const { query } = ctx.request.body;
      if (!query) {
        return ctx.badRequest('Query is required');
      }

      const isValid = await strapi
        .service('api::report.report')
        .isValidQuery(query);

      if (!isValid) {
        return ctx.badRequest('Invalid query');
      }

      return { isValid: true };
    },
  }),
);
