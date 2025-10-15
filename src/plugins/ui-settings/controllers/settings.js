export default {
  settings: {
    async getCategorySettings(ctx) {
      const { category } = ctx.params;

      const settings = await strapi
        .service('api::setting.setting')
        .getSettings(category);

      return settings;
    },

    async updateSetting(ctx) {
      const { category, key } = ctx.params;
      const { value } = ctx.request.body;

      const settings = await strapi
        .service('api::setting.setting')
        .updateSettings(category, { [key]: value });

      return settings;
    },

    async uploadFile(ctx) {
      const { files } = ctx.request;
      if (!files) {
        return ctx.badRequest('No file uploaded');
      }

      const data = await strapi
        .service('api::metadata.upload')
        .privateUpload(files);

      return data;
    },
  },
};
