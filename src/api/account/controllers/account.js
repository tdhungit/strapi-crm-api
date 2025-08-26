'use strict';

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::account.account', ({ strapi }) => ({
  async me(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }
    const entity = await strapi.entityService.findMany('api::account.account', {
      filters: {
        email: user.email,
      },
    });
    return this.transformResponse(entity);
  },
}));
