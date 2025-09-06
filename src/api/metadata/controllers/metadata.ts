export default {
  async getContentTypes(ctx) {
    const contentTypes = await strapi
      .service('api::metadata.metadata')
      .getAllContentTypes();
    ctx.body = contentTypes;
  },

  async getContentTypeConfiguration(ctx) {
    const { uid } = ctx.params;
    const { type = 'content_types' } = ctx.query;
    const config = await strapi
      .service('api::metadata.metadata')
      .getContentTypeConfiguration(uid, type);
    return config;
  },

  async getAllComponents(ctx) {
    const config = await strapi
      .service('api::metadata.metadata')
      .getComponentsConfiguration();
    return config;
  },
};
