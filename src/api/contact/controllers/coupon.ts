import { Context } from 'koa';

export default {
  async find(ctx: Context) {
    return await strapi
      .service('api::coupon.coupon')
      .getAvailableCoupons(ctx.query);
  },
};
