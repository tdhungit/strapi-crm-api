'use strict';

// @ts-ignore
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::account.account', ({ strapi }) => ({
  async findDuplicate(data) {
    const account = await strapi.db.query('api::account.account').findOne({
      where: {
        name: data.name,
      },
    });

    return account;
  },

  async fixDataSave(data) {
    const fixedData = strapi
      .service('api::metadata.metadata')
      .fixDataSave('api::account.account', data);

    return fixedData;
  },

  async createOrUpdate(data) {
    const account = await this.findDuplicate(data);

    const fixedData = await this.fixDataSave(data);

    if (account) {
      return strapi.db.query('api::account.account').update({
        where: {
          id: account.id,
        },
        data: fixedData,
      });
    } else {
      return strapi.db.query('api::account.account').create({
        data: fixedData,
      });
    }
  },
}));
