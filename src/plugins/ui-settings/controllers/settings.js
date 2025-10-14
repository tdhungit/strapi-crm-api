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
  },
};
