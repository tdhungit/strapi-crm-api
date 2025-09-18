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
          const productVariant = await strapi.db
            .query('api::product-variant.product-variant')
            .create({
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
                    product_variant: productVariant.id,
                  },
                });
            }
          }
        }
      }

      return product;
    },

    async update(ctx) {
      const { id: documentId } = ctx.params;
      const data = ctx.request.body.data;
      const productData = { ...data };
      delete productData.product_variants;

      const { id } = await strapi.db.query('api::product.product').findOne({
        where: { documentId: documentId },
      });

      const product = await strapi.db.query('api::product.product').update({
        where: { id },
        data: productData,
      });

      const { product_variants } = data;

      // Get existing variants for this product
      const existingVariants = await strapi.db
        .query('api::product-variant.product-variant')
        .findMany({
          where: { product: id },
        });

      if (product_variants && product_variants.length > 0) {
        const processedVariantIds = [];

        for (const variant of product_variants) {
          const variantData = { ...variant };
          delete variantData.product_variant_attributes;

          let processedVariant;

          // Check if variant exists (by id if provided, or by sku)
          const existingVariant = existingVariants.find(
            (existing) =>
              (variant.id && existing.id === variant.id) ||
              (!variant.id && existing.sku === variant.sku)
          );

          if (existingVariant) {
            // Update existing variant
            processedVariant = await strapi.db
              .query('api::product-variant.product-variant')
              .update({
                where: { id: existingVariant.id },
                data: {
                  ...variantData,
                  product: product.id,
                },
              });
            processedVariantIds.push(existingVariant.id);
          } else {
            // Create new variant
            processedVariant = await strapi.db
              .query('api::product-variant.product-variant')
              .create({
                data: {
                  ...variantData,
                  product: product.id,
                },
              });
            processedVariantIds.push(processedVariant.id);
          }

          // Handle product variant attributes
          const { product_variant_attributes } = variant;

          // Delete existing attributes for this variant
          await strapi.db
            .query('api::product-variant-attribute.product-variant-attribute')
            .deleteMany({
              where: { product_variant: processedVariant.id },
            });

          // Create new attributes
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
                    product_variant: processedVariant.id,
                  },
                });
            }
          }
        }

        // Delete variants that exist in DB but not in the data payload
        const variantsToDelete = existingVariants.filter(
          (existing) => !processedVariantIds.includes(existing.id)
        );

        for (const variantToDelete of variantsToDelete) {
          // Delete variant attributes first
          await strapi.db
            .query('api::product-variant-attribute.product-variant-attribute')
            .deleteMany({
              where: { product_variant: variantToDelete.id },
            });

          // Delete the variant
          await strapi.db.query('api::product-variant.product-variant').delete({
            where: { id: variantToDelete.id },
          });
        }
      } else {
        // If no variants provided, delete all existing variants
        for (const existingVariant of existingVariants) {
          // Delete variant attributes first
          await strapi.db
            .query('api::product-variant-attribute.product-variant-attribute')
            .deleteMany({
              where: { product_variant: existingVariant.id },
            });

          // Delete the variant
          await strapi.db.query('api::product-variant.product-variant').delete({
            where: { id: existingVariant.id },
          });
        }
      }

      return product;
    },
  })
);
