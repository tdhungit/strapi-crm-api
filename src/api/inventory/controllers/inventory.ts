import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::inventory.inventory',
  ({ strapi }) => ({
    async create(ctx) {
      return ctx.badRequest(
        'Inventory creation is disabled via this endpoint.'
      );
    },

    async update(ctx) {
      return ctx.badRequest('Inventory update is disabled via this endpoint.');
    },

    async delete(ctx) {
      return ctx.badRequest(
        'Inventory deletion is disabled via this endpoint.'
      );
    },

    async getAvailableProducts(ctx) {
      const { warehouseId } = ctx.params;
      const { search, date, price_type } = ctx.query;

      let page: number = ctx.query.current
        ? parseInt(ctx.query.current as string, 10)
        : 1;
      let pageSize: number = ctx.query.pageSize
        ? parseInt(ctx.query.pageSize as string, 10)
        : 10;

      if (!warehouseId) {
        return ctx.badRequest('Warehouse ID is required');
      }

      const filterDate = date ? new Date(date as string) : new Date();
      const filterPriceFromDate = strapi
        .service('api::product-price.product-price')
        .filterPriceFromDate(filterDate);
      const where: any = {
        warehouse: {
          id: warehouseId,
        },
        stock_quantity: { $gt: 0 },
        product_variant: {
          variant_status: 'Active',
          product_prices: {
            $and: [
              { price_status: 'Active' },
              {
                ...filterPriceFromDate,
              },
            ],
          },
        },
      };

      if (price_type) {
        where.product_variant.product_prices.$and.push({
          price_type,
        });
      }

      if (search) {
        where.$or = [
          { product_variant: { sku: { $containsi: search } } },
          { product_variant: { product: { name: { $containsi: search } } } },
          {
            product_variant: {
              name: { $containsi: search },
            },
          },
        ];
      }

      const res = await strapi.entityService.findMany(
        'api::inventory.inventory',
        {
          filters: where,
          populate: {
            product_variant: {
              populate: {
                product: true,
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
              },
            },
            warehouse: true,
          },
          limit: pageSize,
          start: page && pageSize ? (page - 1) * pageSize : 0,
        }
      );

      // Count total
      const total = await strapi.db.query('api::inventory.inventory').count({
        where,
      });

      return {
        data: res,
        meta: {
          pagination: {
            page: page,
            pageSize: pageSize,
            pageCount: Math.ceil(total / pageSize),
            total,
          },
        },
      };
    },
  })
);
