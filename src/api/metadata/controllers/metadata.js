'use strict';

module.exports = {
  async getContentTypes(ctx) {
    const contentTypes = await strapi.service('api::metadata.metadata').getContentTypes();
    ctx.body = contentTypes;
  },

  async getContentTypeConfiguration(ctx) {
    const { uid } = ctx.params;

    const config = await strapi.db.query('strapi::core-store').findOne({
      where: {
        key: `plugin_content_manager_configuration_content_types::${uid}`,
      },
    });

    if (!config) {
      return {};
    }

    const parsedValue = JSON.parse(config.value || '{}');
    return {
      uid,
      settings: parsedValue.settings || {},
      metadatas: parsedValue.metadatas || {},
      layouts: parsedValue.layouts || {},
    };
  },
};
