import { Context } from 'koa';

export default {
  async createCheckoutSession(ctx: Context) {
    const { saleOrderId, returnUrl } = ctx.request.body;
    const contactId = ctx.state.contact.id;

    if (!saleOrderId || !returnUrl) {
      return ctx.badRequest('Missing required fields: saleOrderId, returnUrl');
    }

    const saleOrder = await strapi.db
      .query('api::sale-order.sale-order')
      .findOne({
        where: {
          id: saleOrderId,
          contact: contactId,
        },
        populate: ['contact', 'sale_order_details.product_variant'],
      });

    if (!saleOrder) {
      ctx.status = 404;
      ctx.body = { error: 'Sale order not found' };
      return;
    }

    const client_secret = await strapi
      .service('api::payment-method.stripe')
      .createCheckoutSession(saleOrder, {
        returnUrl,
      });
    ctx.body = { client_secret };
  },

  async handlePaymentSuccess(ctx: Context) {
    const { saleOrderId, sessionId } = ctx.request.body;
    const contactId = ctx.state.contact.id;

    const saleOrder = await strapi.db
      .query('api::sale-order.sale-order')
      .findOne({
        where: {
          id: saleOrderId,
          contact: contactId,
        },
        populate: ['sale_order_details.product_variant'],
      });

    if (!saleOrder) {
      ctx.status = 404;
      ctx.body = { error: 'Sale order not found' };
      return;
    }

    return await strapi
      .service('api::payment-method.stripe')
      .posPaymentSuccess(saleOrder, sessionId);
  },
};
