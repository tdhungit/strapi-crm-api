import { Context } from 'koa';

export default {
  async createOrder(ctx: Context) {
    const { saleOrderId } = ctx.request.body;

    const order = await strapi.db.query('api::sale-order.sale-order').findOne({
      where: {
        id: saleOrderId,
      },
      populate: ['contact'],
    });

    if (!order) {
      return ctx.throw(400, 'Order not found');
    }

    return await strapi
      .service('api::payment-method.paypal')
      .createOrder(order);
  },

  async approveOrder(ctx: Context) {
    const { saleOrderId } = ctx.request.body;

    const order = await strapi.db.query('api::sale-order.sale-order').findOne({
      where: {
        id: saleOrderId,
      },
      populate: ['contact'],
    });

    if (!order) {
      return ctx.throw(400, 'Order not found');
    }

    return await strapi
      .service('api::payment-method.paypal')
      .approveOrder(order);
  },
};
