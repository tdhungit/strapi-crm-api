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
};
