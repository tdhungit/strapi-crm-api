'use strict';

module.exports = {
  async getContentTypes(ctx) {
    const contentTypes = await strapi.service('api::metadata.metadata').getContentTypes();
    ctx.body = contentTypes;
  },

  async getContentTypeConfiguration(ctx) {
    const { uid } = ctx.params;
    const config = await strapi.service('api::metadata.metadata').getContentTypeConfiguration(uid);
    return config;
  },
};
