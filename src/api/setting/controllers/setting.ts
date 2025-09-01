import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::setting.setting',
  ({ strapi }) => ({
    async getAppSettings(ctx) {
      let settings = {};

      // get all content types
      settings['content-types'] = await strapi
        .service('api::metadata.metadata')
        .getAllContentTypes();

      // get main menus
      const availableMenus = await strapi
        .service('api::setting.setting')
        .getAvailableMenus();
      if (availableMenus.length > 0) {
        settings['init'] = false;
        settings['menus'] = availableMenus;
      } else {
        // get default menus
        const defaultMenus = await strapi
          .service('api::setting.setting')
          .getDefaultMenus();
        settings['init'] = true;
        settings['menus'] = defaultMenus;
      }

      // get logo
      const logos = await strapi.service('api::metadata.metadata').getLogo();
      if (logos) {
        try {
          settings['logo'] = JSON.parse(logos);
        } catch (error) {
          settings['logo'] = {};
        }
      }

      // get ui config
      const uiConfigs = await strapi.db.query('strapi::core-store').findOne({
        where: {
          key: `plugin_ui-settings_config`,
        },
      });
      if (uiConfigs?.value) {
        settings['uiConfig'] = JSON.parse(uiConfigs.value);
      }

      return settings;
    },

    async getAvailableMenus() {
      const menus = await strapi
        .service('api::setting.setting')
        .getAvailableMenus();
      return menus;
    },

    async getHiddenMenus() {
      const hiddenMenus = await strapi
        .service('api::setting.setting')
        .getHiddenMenus();
      return hiddenMenus;
    },

    async updateMenus(ctx) {
      const { body } = ctx.request;

      // check setting menu not exist -> create it
      const setting = await strapi.db.query('api::setting.setting').findOne({
        where: {
          category: 'system',
          name: 'menu',
        },
      });

      if (setting) {
        const result = await strapi.db.query('api::setting.setting').update({
          where: {
            category: 'system',
            name: 'menu',
          },
          data: {
            values: body,
          },
        });

        return {
          message: 'Update success',
          data: result,
          id: setting.id,
        };
      }

      const result = await strapi.db.query('api::setting.setting').create({
        data: {
          category: 'system',
          name: 'menu',
          values: body,
        },
      });

      return {
        message: 'Create success',
        data: result,
        id: result.id,
      };
    },

    async getSettings(ctx) {
      const { category } = ctx.params;
      const settings = await strapi
        .service('api::setting.setting')
        .getSettings(category);
      return settings;
    },

    async updateSettings(ctx) {
      const { category } = ctx.params;
      const { body } = ctx.request;
      const settings = await strapi
        .service('api::setting.setting')
        .updateSettings(category, body);
      return settings;
    },

    async getLogo(ctx) {
      const branding = await strapi.service('api::metadata.metadata').getLogo();
      return branding;
    },
  })
);
