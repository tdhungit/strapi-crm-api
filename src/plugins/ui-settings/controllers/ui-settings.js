module.exports = {
  'ui-settings': {
    async getConfig(ctx) {
      return await strapi.service('api::setting.setting').getCRMSettings();
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

        // Update e-commerce setting auth service
        if (ctx.request.body.thirdPartyService) {
          const eCommerceSetting = await strapi.db
            .query('api::setting.setting')
            .findOne({
              where: {
                category: 'system',
                name: 'ecommerce',
              },
            });

          if (eCommerceSetting?.values) {
            await strapi.db.query('api::setting.setting').update({
              where: {
                id: eCommerceSetting.id,
              },
              data: {
                values: {
                  ...eCommerceSetting.values,
                  authService: ctx.request.body.thirdPartyService,
                },
              },
            });
          }
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

    async getMailServices(ctx) {
      try {
        const mailServices = await strapi
          .service('api::email-template.email')
          .getMailServices();
        return mailServices;
      } catch (error) {
        console.error('Error getting mail services:', error);
        return ctx.badRequest('Error getting mail services');
      }
    },
  },
};
