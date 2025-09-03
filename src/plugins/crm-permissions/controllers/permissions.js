export default {
  permissions: {
    async getDepartments(ctx) {
      const result = await strapi.service('api::department.department').find({
        populate: ['users'],
      });
      ctx.send(result);
    },

    async getDepartmentPermissions(ctx) {
      const departmentId = ctx.params.id ? parseInt(ctx.params.id) : null;
      if (!departmentId) {
        ctx.send({ error: 'Department id is required' });
      }
      // get department
      const department = await strapi.db
        .query('api::department.department')
        .findOne({
          where: { id: departmentId },
          populate: ['users'],
        });

      if (!department) {
        ctx.send({ error: 'Department not found', id: departmentId });
      }

      const result = await strapi
        .service('api::department.department')
        .getPermissions(departmentId);

      return {
        department: department,
        permissions: result,
      };
    },

    async saveDepartmentPermissions(ctx) {
      const id = ctx.params.id;
      const department = await strapi.db
        .query('api::department.department')
        .findOne({
          where: { id: id },
          populate: ['users'],
        });

      if (!department) {
        ctx.send({ error: 'Department not found', id: id });
      }

      const permissions = ctx.request.body;
      const result = await strapi.db
        .query('api::department.department')
        .update({
          where: { id: id },
          data: {
            permissions: permissions,
          },
        });

      return {
        department: department,
        permissions: result,
      };
    },
  },
};
