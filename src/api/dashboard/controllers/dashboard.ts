import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::dashboard.dashboard',
  ({ strapi }) => ({
    async create(ctx) {
      const { data, meta } = await super.create(ctx);

      if (data.is_default) {
        const user = ctx.state.user;
        await strapi.db.query('api::dashboard.dashboard').update({
          where: {
            assigned_user: { id: user.id },
            is_default: true,
            id: { $ne: data.id },
          },
          data: { is_default: false },
        });
      }

      return { data, meta };
    },

    async update(ctx) {
      const { data, meta } = await super.update(ctx);

      if (data.is_default) {
        const user = ctx.state.user;
        await strapi.db.query('api::dashboard.dashboard').update({
          where: {
            assigned_user: { id: user.id },
            is_default: true,
            id: { $ne: data.id },
          },
          data: { is_default: false },
        });
      }

      return { data, meta };
    },
  }),
);
