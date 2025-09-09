import { Context } from 'koa';

export default {
  async countCollectionByCreatedAt(ctx: Context) {
    const { collection } = ctx.params;
    const { type, start, end } = ctx.query;
    return await strapi
      .service('api::widget.widget')
      .countCollectionByCreatedAt(collection, type, { start, end });
  },
};
