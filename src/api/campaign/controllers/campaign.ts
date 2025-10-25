import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::campaign.campaign',
  ({ strapi }) => ({
    async runAction(ctx) {
      const { id, actionId } = ctx.params;

      const action = await strapi.db
        .query('api::campaign-action.campaign-action')
        .findOne({
          where: {
            id: actionId,
            campaign: {
              id,
            },
          },
        });

      if (!action) {
        return ctx.notFound('Action not found');
      }

      const res = await strapi
        .service('api::campaign-action.campaign-action')
        .runAction(action.id);

      return res;
    },
  }),
);
