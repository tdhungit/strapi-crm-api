import { Context } from 'koa';
import { NormalizeDataType, ProductFormType } from '../types/openapi';

export default {
  async create(ctx: Context) {
    const productObject: ProductFormType = ctx.request.body;

    const normalize: NormalizeDataType = await strapi
      .service('api::product.openapi')
      .normalizeProduct(productObject);

    // Create product category
    let productCategory: any;
    productCategory = await strapi.db
      .query('api::product-category.product-category')
      .findOne({ where: { name: normalize.product_category.name } });

    if (!productCategory) {
      productCategory = await strapi.db
        .query('api::product-category.product-category')
        .create({
          data: {
            ...normalize.product_category,
          },
        });
    }

    // Create product vendor
    let productVendor: any;
    productVendor = await strapi.db.query('api::vendor.vendor').findOne({
      where: { name: normalize.vendor.name },
    });

    if (!productVendor) {
      productVendor = await strapi.db.query('api::vendor.vendor').create({
        data: {
          ...normalize.vendor,
        },
      });
    }

    // Create product attributes
    for await (const attribute of normalize.product_attributes) {
      let productAttribute = await strapi.db
        .query('api::product-attribute.product-attribute')
        .findOne({
          where: {
            name: attribute.name,
            product_category: { id: productCategory.id },
          },
        });

      if (!productAttribute) {
        productAttribute = await strapi.db
          .query('api::product-attribute.product-attribute')
          .create({
            data: {
              ...attribute,
              product_category: { connect: { id: productCategory.id } },
            },
          });
      }
    }

    // Create product
    const product = await strapi.db.query('api::product.product').create({
      data: {
        ...normalize.product,
        product_category: { connect: { id: productCategory.id } },
      },
    });

    // Create product variants
    for await (const variant of normalize.product_variants) {
      const variant_options = variant.variant_options || [];
      delete variant.variant_options;
      const productVariant = await strapi.db
        .query('api::product-variant.product-variant')
        .create({
          data: {
            ...variant,
            photos:
              variant?.photos?.length > 0
                ? variant.photos
                : normalize.product.photos,
            product: { connect: { id: product.id } },
          },
        });

      // Save product variant attributes
      for await (const option of variant_options) {
        const attribute = await strapi.db
          .query('api::product-attribute.product-attribute')
          .findOne({
            where: {
              name: option.name,
              product_category: { id: productCategory.id },
            },
          });

        if (attribute) {
          await strapi.db
            .query('api::product-variant-attribute.product-variant-attribute')
            .create({
              data: {
                product_variant: { connect: { id: productVariant.id } },
                product_attribute: { connect: { id: attribute.id } },
                attribute_value: option.value,
                attribute_status: 'Active',
              },
            });
        }
      }

      // Create product prices
      for await (const price of normalize.product_prices) {
        await strapi.db.query('api::product-price.product-price').create({
          data: {
            ...price,
            product_variant: { connect: { id: productVariant.id } },
          },
        });
      }
    }

    return product;
  },

  async update(ctx: Context) {
    const productObject: ProductFormType = ctx.request.body;
  },
};
