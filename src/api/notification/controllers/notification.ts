import { Context } from 'koa';

export default {
  async send(ctx: Context) {
    const { userId, title, message } = ctx.request.body;

    if (!userId || !title || !message) {
      return ctx.throw(400, 'Missing required parameters');
    }

    await strapi
      .service('api::notification.notification')
      .send(userId, title, message);

    return ctx.send({ success: true });
  },
};
