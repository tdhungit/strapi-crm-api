'use strict';

module.exports = {
  register(/*{ strapi }*/) {},

  bootstrap({ strapi }) {
    const modelsWithAssignedUser = Object.values(strapi.contentTypes)
      .filter((ct) => ct.uid.startsWith('api::') && ct.attributes?.assigned_user)
      .map((ct) => ct.uid);

    strapi.db.lifecycles.subscribe({
      models: modelsWithAssignedUser,
      async beforeCreate(event) {
        // @TODO
      },

      async beforeFindMany(event) {
        // @TODO
      },
    });
  },
};
