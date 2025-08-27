'use strict';

/**
 * setting controller
 */

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::setting.setting', ({ strapi }) => ({
  async getAppSettings(ctx) {
    let settings = {};

    settings['content-types'] = await strapi.service('api::metadata.metadata').getAllContentTypes();

    const availableMenus = await strapi.service('api::setting.setting').getAvailableMenus();
    if (availableMenus.length > 0) {
      settings['init'] = false;
      settings['menus'] = availableMenus;
    } else {
      // get default menus
      const defaultMenus = await strapi.service('api::setting.setting').getDefaultMenus();
      settings['init'] = true;
      settings['menus'] = defaultMenus;
    }

    return settings;
  },

  async getAvailableMenus() {
    const menus = await strapi.service('api::setting.setting').getAvailableMenus();
    return menus;
  },

  async getHiddenMenus() {
    const hiddenMenus = await strapi.service('api::setting.setting').getHiddenMenus();
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
    const settings = await strapi.service('api::setting.setting').getSettings(category);
    return settings;
  },

  async updateSettings(ctx) {
    const { category } = ctx.params;
    const { body } = ctx.request;
    const settings = await strapi.service('api::setting.setting').updateSettings(category, body);
    return settings;
  },

  async getLogo(ctx) {
    const branding = await strapi.db.query('strapi::core-store').findOne({
      where: {
        key: `core_admin_project-settings`,
      },
    });

    if (!branding) {
      return {};
    }

    return branding.value;
  },
}));
