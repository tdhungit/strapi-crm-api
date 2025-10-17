module.exports = {
  addresses: {
    async importAddressData(ctx) {
      await strapi.service('api::address.address').importAddressData();
      return { status: 'ok' };
    },

    async getAddressStatistics(ctx) {
      const result = await strapi
        .service('api::address.address')
        .getAddressStatistics();
      return result;
    },
  },
};
