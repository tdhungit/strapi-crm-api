import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController(
  'api::invoice.invoice',
  ({ strapi }) => ({
    async renderHtml(ctx: Context) {
      const { id } = ctx.params;
      const invoice = await strapi.db.query('api::invoice.invoice').findOne({
        where: { documentId: id },
        populate: ['sale_order', 'payment'],
      });

      if (!invoice) {
        return ctx.throw(404, 'Invoice not found');
      }

      const html = await strapi
        .service('api::invoice.invoice')
        .generateHtml(invoice);
      ctx.set('Content-Type', 'text/text; charset=utf-8');
      return ctx.send(html);
    },
  }),
);
