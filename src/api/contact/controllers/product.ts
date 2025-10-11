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

  async findProduct(ctx: Context) {
    const { id } = ctx.params;

    const { date } = ctx.query;

    const filterDate = date ? new Date(date as string) : new Date();
    const filterPriceFromDate = strapi
      .service('api::product-price.product-price')
      .filterPriceFromDate(filterDate);

    const product = await strapi.db.query('api::product.product').findOne({
      populate: {
        product_variants: {
          populate: {
            product_prices: {
              sort: { createdAt: 'desc' },
              filters: {
                $and: [
                  { price_status: 'Active' },
                  {
                    ...filterPriceFromDate,
                  },
                ],
              },
            },
            product_variant_attributes: {
              populate: {
                product_attribute: true,
              },
            },
          },
        },
      },
      where: {
        id,
        product_variants: {
          variant_status: 'Active',
          product_prices: {
            $and: [
              {
                price_status: 'Active',
              },
              {
                price_type: 'Sale',
              },
              {
                $or: [{ ...filterPriceFromDate }],
              },
            ],
          },
        },
      },
    });

    return product;
  },

  async findCategory(ctx: Context) {
    const { id } = ctx.params;
    return await strapi.db
      .query('api::product-category.product-category')
      .findOne({ where: { id } });
  },
};
