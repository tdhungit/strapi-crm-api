import { Context } from 'koa';
import userPermissionService from '../services/user-permission';

export default {
  async getRoutes(ctx: Context) {
    const { page = 1, pageSize = 50, apiName } = ctx.query;

    const { routes, meta } = await userPermissionService.getRoutes({
      page: Number(page),
      pageSize: Number(pageSize),
      apiName: apiName as string,
    });
    ctx.body = { routes, meta };
  },

  async findOne(ctx: Context) {
    const { id } = ctx.params;
    const role = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({
        where: { id },
      });
    ctx.body = role;
  },
};
