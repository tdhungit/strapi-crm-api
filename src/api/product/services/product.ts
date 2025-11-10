import { factories } from '@strapi/strapi';
import dayjs from 'dayjs';

export default factories.createCoreService(
  'api::product.product',
  ({ strapi }) => ({
    async findAvailableProducts(
      date: Date,
      warehouseId: number,
      priceType: string = 'Sale',
      options?: { categoryId?: number; limit?: number; offset?: number },
      filters?: {
        keyword?: string;
        category?: number[];
        brand?: number[];
        price?: number[];
      },
    ) {
      const dateStr = dayjs(date).format('YYYY-MM-DD');
      const selectCount = 'count(products.id) as total';
      const select = `
        products.*,
        products.photos::json as photos,
        min(product_prices.price) as from_price,
        max(product_prices.price) as to_price,
        min(product_prices.before_price) as min_before_price,
        max(product_prices.before_price) as max_before_price
      `;

      const getQuery = (
        select: string,
        categoryId?: number,
        filters?: {
          keyword?: string;
          category?: number[];
          brand?: number[];
          price?: number[];
        },
      ): string => {
        let andWhere = '';
        let categoryJoin = '';
        if (categoryId) {
          categoryJoin =
            'join products_product_category_lnk on products_product_category_lnk.product_id = products.id';
          andWhere = ` and products_product_category_lnk.product_category_id = ${categoryId}`;
        }

        if (filters?.keyword) {
          andWhere += ` and (products.name like '%${filters.keyword}%' or product_variants.sku like '%${filters.keyword}%' or product_variants.barcode like '%${filters.keyword}%')`;
        }

        if (filters?.brand?.length > 0) {
          andWhere += ` and product_variants.brand_id in (${filters.brand.join(',')})`;
        }

        if (filters?.category?.length > 0) {
          if (!categoryJoin) {
            categoryJoin =
              'join products_product_category_lnk on products_product_category_lnk.product_id = products.id';
          }
          andWhere += ` and products_product_category_lnk.product_category_id in (${filters.category.join(',')})`;
        }

        if (filters?.price?.length > 0) {
          andWhere += ` and (product_prices.price >= ${filters.price[0]} and product_prices.price <= ${filters.price[1]})`;
        }

        return `
          select
            ${select}
          from
            products
            join product_variants_product_lnk on product_variants_product_lnk.product_id = products.id
            join product_variants on product_variants.id = product_variants_product_lnk.product_variant_id
            join inventories_product_variant_lnk on inventories_product_variant_lnk.product_variant_id = product_variants.id
            join inventories on inventories.id = inventories_product_variant_lnk.inventory_id
            join product_prices_product_variant_lnk on product_prices_product_variant_lnk.product_variant_id = product_variants.id
            join product_prices on product_prices.id = product_prices_product_variant_lnk.product_price_id
            join inventories_warehouse_lnk on inventories_warehouse_lnk.inventory_id = inventories.id
            ${categoryJoin}
          where
            product_variants.variant_status = 'Active'
            and inventories.stock_quantity > 0
            and product_prices.price_status = 'Active'
            and product_prices.price_type = ?
            and inventories_warehouse_lnk.warehouse_id = ?
            and (
              (
                product_prices.start_date is null
                and product_prices.end_date is null
              )
              or (
                product_prices.start_date >= ?
                and product_prices.end_date <= ?
              )
              or (
                product_prices.start_date is null
                and product_prices.end_date <= ?
              )
              or (
                product_prices.start_date >= ?
                and product_prices.end_date is null
              )
            )
            ${andWhere}
          group by
            products.id
          limit ?
          offset ?
        `;
      };

      const knex = strapi.db.connection;

      const [products, total] = await Promise.all([
        knex.raw(getQuery(select, options?.categoryId, filters), [
          priceType,
          warehouseId,
          dateStr,
          dateStr,
          dateStr,
          dateStr,
          options?.limit || 10,
          options?.offset || 0,
        ]),
        knex.raw(getQuery(selectCount, options?.categoryId, filters), [
          priceType,
          warehouseId,
          dateStr,
          dateStr,
          dateStr,
          dateStr,
          options?.limit || 10,
          options?.offset || 0,
        ]),
      ]);

      return {
        data: products.rows,
        meta: {
          pagination: {
            total: total.rows[0]?.total ? parseInt(total.rows[0].total) : 0,
            page: options?.offset ? options.offset / options.limit + 1 : 1,
            pageSize: options?.limit || 10,
            pageCount: Math.ceil(
              (total.rows[0]?.total || 0) / (options?.limit || 10),
            ),
          },
        },
      };
    },
  }),
);
