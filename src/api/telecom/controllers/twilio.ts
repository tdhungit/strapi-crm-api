import { Context } from 'koa';

export default {
  async voiceHandler(ctx: Context) {
    return await strapi
      .service('api::setting.twilio')
      .voiceHandler(ctx.request.body);
  },
};
