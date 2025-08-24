'use strict';

module.exports = {
  async getAllUsers(ctx) {
    const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
      fields: [
        'id',
        'username',
        'email',
        'provider',
        'confirmed',
        'blocked',
        'createdAt',
        'updatedAt',
      ],
      populate: {
        role: {
          fields: ['id', 'name', 'description', 'type'],
        },
      },
    });

    return users;
  },
};
