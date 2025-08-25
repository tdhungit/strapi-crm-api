'use strict';

module.exports = {
  async getAllUsers(ctx) {
    const filters = ctx.query.filters || {};
    const sort = ctx.query.sort || ['id:asc'];
    let { page, pageSize } = ctx.query;

    const config = await strapi
      .service('api::metadata.metadata')
      .getContentTypeConfiguration('plugin::users-permissions.user');
    page = page || 1;
    pageSize = pageSize || config.settings.pageSize;

    const allFields = strapi.getModel('plugin::users-permissions.user').attributes;
    const safeFields = [];
    for (const fieldName in allFields) {
      const field = allFields[fieldName];
      if (
        !['resetPasswordToken', 'confirmationToken'].includes(fieldName) &&
        field.type !== 'password' &&
        field.type !== 'relation'
      ) {
        safeFields.push(fieldName);
      }
    }

    const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
      fields: safeFields,
      populate: ['role'],
      limit: parseInt(pageSize, 10),
      start: (page - 1) * pageSize,
      filters,
      sort,
    });

    // Count total
    const total = await strapi.db.query('plugin::users-permissions.user').count({
      where: ctx.query.filters || {},
    });

    return {
      data: users,
      meta: {
        pagination: {
          page: parseInt(page, 10),
          pageSize: parseInt(pageSize, 10),
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  },
};
