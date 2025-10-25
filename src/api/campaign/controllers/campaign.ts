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

      // Update status
      await strapi.db.query('api::campaign-action.campaign-action').update({
        where: {
          id: actionId,
        },
        data: {
          action_status: 'Running',
        },
      });

      return {
        status: 'Running',
        data: action,
      };
    },
  }),
);
