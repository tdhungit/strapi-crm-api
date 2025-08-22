'use strict';

module.exports = {
  async getContentTypes(ctx) {
    const contentTypes = await strapi.service('api::metadata.metadata').getContentTypes();
    ctx.body = contentTypes;
  },
};
