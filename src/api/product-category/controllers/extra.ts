import { Context } from 'koa';

export default {
  async getTreeProductCategories(ctx: Context) {
    const roots = await strapi
      .service('api::product-category.product-category')
      .getTreeProductCategories();
    ctx.body = roots;
  },
};
