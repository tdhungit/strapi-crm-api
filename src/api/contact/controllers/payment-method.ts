import { Context } from 'koa';

export default {
  async findAll(ctx: Context) {
    const methods = await strapi.db
      .query('api::payment-method.payment-method')
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

    const entity = await strapi.db
      .query('api::payment-method.payment-method')
      .findOne({ where: { id } });

    if (!entity) {
      return ctx.throw(400, 'Payment method not found');
    }

    const options = strapi
      .service('api::payment-method.payment-method')
      .getPublicOptions(entity);

    entity.options = options;

    return {
      data: entity,
      meta: {},
    };
  },

  async findByName(ctx: Context) {
    const { name } = ctx.params;

    const method = await strapi.db
      .query('api::payment-method.payment-method')
      .findOne({ where: { name } });

    if (!method) {
      return ctx.throw(400, 'Payment method not found');
    }

    const options = strapi
      .service('api::payment-method.payment-method')
      .getPublicOptions(method);

    return {
      id: method.id,
      documentId: method.documentId,
      name: method.name,
      description: method.description,
      enabled: method.enabled,
      options,
    };
  },
};
