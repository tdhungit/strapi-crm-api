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
      settings['menus'] = availableMenus;
    } else {
      // get default menus
      const defaultMenus = await strapi.service('api::setting.setting').getDefaultMenus();
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
}));
