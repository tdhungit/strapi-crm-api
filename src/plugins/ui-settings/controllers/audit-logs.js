module.exports = {
  'audit-logs': {
    async saveSettings(ctx) {
      const data = ctx.request.body;

      const store = strapi.db.query('strapi::core-store');
      const settings = await store.findOne({
        where: {
          key: `plugin_ui-settings_audit-logs_config`,
        },
      });

      if (settings) {
        await store.update({
          where: {
            key: `plugin_ui-settings_audit-logs_config`,
          },
          data: {
            value: JSON.stringify(data),
          },
        });
      } else {
        await store.create({
          data: {
            key: `plugin_ui-settings_audit-logs_config`,
            value: JSON.stringify(data),
          },
        });
      }
      return { status: 'ok' };
    },

    async getSettings(ctx) {
      const contentTypes = await strapi
        .service('api::metadata.metadata')
        .getCRMContentTypes();
      const data = {
        availableContentTypes: contentTypes,
        auditContentTypes: [],
      };

      const store = strapi.db.query('strapi::core-store');
      const setting = await store.findOne({
        where: {
          key: `plugin_ui-settings_audit-logs_config`,
        },
      });

      if (setting) {
        const config = JSON.parse(setting.value);
        data.availableContentTypes =
          config.availableContentTypes || contentTypes;
        data.auditContentTypes = config.auditContentTypes || [];
      }

      // availableContentTypes is content types and not in auditContentTypes
      data.availableContentTypes = contentTypes.filter(
        (contentType) =>
          !data.auditContentTypes.find((x) => x.uid === contentType.uid),
      );

      return data;
    },
  },
};
