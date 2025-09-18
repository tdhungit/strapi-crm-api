import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::setting.setting',
  ({ strapi }) => ({
    async getAppSettings(ctx) {
      let settings = {};

      // get all content types
      const allContentTypes = await strapi
        .service('api::metadata.metadata')
        .getAllContentTypes();

      let showContentTypes = [];
      allContentTypes.forEach((item) => {
        if (!item.uid.startsWith('admin::')) {
          showContentTypes.push(item);
        }
      });
      // get public content types
      settings['content-types'] = showContentTypes;

      // get components
      const components = await strapi
        .service('api::metadata.metadata')
        .getComponentsConfiguration();
      settings['components'] = components;

      // get main menus
      const availableMenus = await strapi
        .service('api::setting.setting')
        .getAvailableMenus();
      if (availableMenus.length > 0) {
        settings['init'] = false;
        settings['menus'] = availableMenus;
      } else {
        // get default menus
        const defaultMenus = [];
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
        const uiConfigObj = JSON.parse(uiConfigs.value);
        if (uiConfigObj.favicon) {
          if (
            uiConfigObj.favicon.indexOf('http://') === -1 &&
            uiConfigObj.favicon.indexOf('https://') === -1
          ) {
            const baseUrl = process.env.PUBLIC_URL;
            uiConfigObj.favicon = `${baseUrl}${uiConfigObj.favicon}`;
          }
        }
        settings['uiConfig'] = uiConfigObj;
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
      const { name = '' } = ctx.query;
      const user = ctx.state.user;
      const settings = await strapi
        .service('api::setting.setting')
        .getSettings(category, name, user);
      return settings;
    },

    async getPaginateSettings(ctx) {
      const { category } = ctx.params;
      const user = ctx.state.user;
      const settings = await strapi.service('api::setting.setting').find({
        where: {
          category,
          user: {
            id: user.id,
          },
        },
      });
      return settings;
    },

    async updateSettings(ctx) {
      const { category } = ctx.params;
      const { body } = ctx.request;
      const user = ctx.state.user;
      const settings = await strapi
        .service('api::setting.setting')
        .updateSettings(category, body, user);
      return settings;
    },

    async getLogo(ctx) {
      const branding = await strapi.service('api::metadata.metadata').getLogo();
      return branding;
    },
  })
);
