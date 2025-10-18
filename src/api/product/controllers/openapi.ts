import { Context } from 'koa';
import { ProductFormType } from '../types/openapi.product';

export default {
  async create(ctx: Context) {
    const productObject: ProductFormType = ctx.request.body;

    // Create product
    const product = await strapi.db.query('api::product.product').create({
      data: {},
    });
  },

  async update(ctx: Context) {
    const productObject: ProductFormType = ctx.request.body;
  },
};
