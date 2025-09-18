import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController(
  'api::product.product',
  ({ strapi }) => ({
    async create(ctx: Context) {
      const data = ctx.request.body.data;

      const productData = { ...data };
      delete productData.product_variants;
      const product = await strapi.db
        .query('api::product.product')
        .create({ data: productData });

      const { product_variants } = data;

      if (product_variants && product_variants.length > 0) {
        for (const variant of product_variants) {
          const variantData = { ...variant };
          delete variantData.product_variant_attributes;
          await strapi.db.query('api::product-variant.product-variant').create({
            data: {
              ...variantData,
              product: product.id,
            },
          });

          const { product_variant_attributes } = variant;
          if (
            product_variant_attributes &&
            product_variant_attributes.length > 0
          ) {
            for (const attribute of product_variant_attributes) {
              await strapi.db
                .query(
                  'api::product-variant-attribute.product-variant-attribute'
                )
                .create({
                  data: {
                    ...attribute,
                    product_variant: variant.id,
                  },
                });
            }
          }
        }
      }

      return product;
    },

    async update(ctx) {
      const { id } = ctx.params;
      const data = ctx.request.body.data;
      return {};
    },
  })
);
