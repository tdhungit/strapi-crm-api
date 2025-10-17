module.exports = {
  'ui-settings': {
    async getConfig(ctx) {
      try {
        const store = strapi.db.query('strapi::core-store');
        const settings = await store.findOne({
          where: {
            key: `plugin_ui-settings_config`,
          },
        });
        if (settings?.value) {
          return settings.value;
        }
        return {};
      } catch (error) {
        console.error('Error getting UI settings config:', error);
        return {};
      }
    },

    async setConfig(ctx) {
      try {
        const store = strapi.db.query('strapi::core-store');
        const settings = await store.findOne({
          where: {
            key: `plugin_ui-settings_config`,
          },
        });
        if (settings) {
          await store.update({
            where: {
              key: `plugin_ui-settings_config`,
            },
            data: {
              value: JSON.stringify(ctx.request.body),
            },
          });
        } else {
          await store.create({
            data: {
              key: `plugin_ui-settings_config`,
              value: JSON.stringify(ctx.request.body),
            },
          });
        }
        return { status: 'ok' };
      } catch (error) {
        console.error('Error setting UI settings config:', error);
        return { status: 'error' };
      }
    },

    async uploadFavicon(ctx) {
      try {
        const { files } = ctx.request;
        if (!files) {
          return ctx.badRequest('No file uploaded');
        }
        const file = files.file;
        const fileObj = Array.isArray(file) ? file[0] : file;
        const uploadService = strapi.plugin('upload').service('upload');
        const [upload] = await uploadService.upload({
          files: fileObj,
          data: {
            fileInfo: {
              name: fileObj.originalFilename,
            },
          },
        });
        return upload;
      } catch (error) {
        console.error('Error uploading favicon:', error);
        return ctx.badRequest('Error uploading favicon');
      }
    },
  },
};
