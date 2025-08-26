'use strict';

// @ts-ignore
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::setting.setting', ({ strapi }) => ({
  async getDefaultMenus() {
    // get content types
    const contentTypes = await strapi.service('api::metadata.metadata').getContentTypes();

    let menus = [];
    let weight = 1;
    contentTypes.forEach((item) => {
      menus.push({
        ...item,
        key: '_' + item.pluralName,
        label: item.name,
        collection: item.pluralName,
        weight,
      });
      weight++;
    });

    return menus;
  },

  async getAvailableMenus() {
    let menus = [];
    const settingMenus = await strapi.db.query('api::setting.setting').findOne({
      where: {
        category: 'system',
        name: 'menu',
      },
    });

    if (settingMenus) {
      settingMenus.values.forEach((item) => {
        menus.push(item);
      });
    }

    // sort by weight
    menus.sort((a, b) => a.weight - b.weight);

    return menus;
  },

  async getHiddenMenus() {
    const defaultMenus = await this.getDefaultMenus();
    const availableMenus = await this.getAvailableMenus();

    let hiddenMenus = defaultMenus.filter((item) => {
      // find item key in available menus
      return !availableMenus.find((menu) => menu.key === item.key);
    });

    return hiddenMenus;
  },

  async getSettings(category) {
    const settings = await strapi.db.query('api::setting.setting').findMany({
      where: {
        category,
      },
    });

    const result = {};
    settings.forEach((item) => {
      result[item.name] = item.values;
    });

    return result;
  },

  async updateSettings(category, body) {
    for (let key in body) {
      await strapi.db.query('api::setting.setting').updateOrCreate({
        where: {
          category,
          name: key,
        },
        data: {
          category,
          name: key,
          values: body[key],
        },
      });
    }
    return this.getSettings(category);
  },
}));
