import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::campaign-action.campaign-action',
  () => ({
    async runAction(actionId: number) {
      const action = await strapi.db
        .query('api::campaign-action.campaign-action')
        .findOne({
          where: {
            id: actionId,
          },
        });
      await strapi.service('api::campaign-action.action').run(action);
    },
  })
);
