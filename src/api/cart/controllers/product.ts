import dayjs from 'dayjs';
import { Context } from 'koa';

export default {
  async findAvailableProducts(ctx: Context) {
    const page: number = ctx.query.page
      ? parseInt(ctx.query.page as string, 10)
      : 1;
    const pageSize: number = ctx.query.pageSize
      ? parseInt(ctx.query.pageSize as string, 10)
      : 10;
    const start = (page - 1) * pageSize;
    const limit = pageSize;

    const date = ctx.query.date || dayjs().format('YYYY-MM-DD');
    const warehouseId = ctx.query.warehouseId;

    if (!warehouseId) {
      return ctx.badRequest('Warehouse ID is required');
    }

    return strapi
      .service('api::product.product')
      .findAvailableProducts(date, warehouseId, 'Sale', {
        categoryId: ctx.query.categoryId,
        limit,
        offset: start,
      });
  },
};
