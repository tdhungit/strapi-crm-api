import { Context } from 'koa';

export default {
  async findAll(ctx: Context) {
    const methods = await strapi.db
      .query('api::shipping-method.shipping-method')
      .findMany({});

    return methods.map((method) => ({
      id: method.id,
      documentId: method.documentId,
      name: method.name,
      description: method.description,
      enabled: method.enabled,
    }));
  },

  async findOne(ctx: Context) {
    const { id } = ctx.params;
    const method = await strapi.db
      .query('api::shipping-method.shipping-method')
      .findOne({
        where: { id },
      });

    if (!method) {
      return ctx.notFound('Shipping method not found');
    }

    return {
      id: method.id,
      documentId: method.documentId,
      name: method.name,
      description: method.description,
      enabled: method.enabled,
    };
  },

  async findByName(ctx: Context) {
    const { name } = ctx.params;
    const method = await strapi.db
      .query('api::shipping-method.shipping-method')
      .findOne({
        where: { name },
      });

    if (!method) {
      return ctx.notFound('Shipping method not found');
    }

    return {
      id: method.id,
      documentId: method.documentId,
      name: method.name,
      description: method.description,
      enabled: method.enabled,
    };
  },

  async getShippingAmount(ctx: Context) {
    const { contactAddressId, shippingMethodId, couponIds } = ctx.request.body;
    const contactAddress = await strapi.db
      .query('api::contact-address.contact-address')
      .findOne({
        where: { id: contactAddressId },
      });

    if (!contactAddress) {
      return ctx.notFound('Contact address not found');
    }

    const shippingMethod = await strapi.db
      .query('api::shipping-method.shipping-method')
      .findOne({
        where: { id: shippingMethodId },
      });

    if (!shippingMethod) {
      return ctx.notFound('Shipping method not found');
    }

    let coupons = [];
    if (couponIds && couponIds.length > 0) {
      coupons = await strapi.db.query('api::coupon.coupon').findMany({
        where: {
          id: {
            $in: couponIds,
          },
        },
      });
    }

    return await strapi
      .service('api::shipping-method.shipping-method')
      .getShippingAmount(contactAddress, shippingMethod, coupons);
  },
};
