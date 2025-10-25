import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::campaign-action.campaign-action',
  () => ({
    async checkAndProcessAction() {
      const actions = await strapi.db
        .query('api::campaign-action.campaign-action')
        .findMany({
          where: {
            action_status: 'Running',
          },
          populate: ['campaign'],
        });

      actions.forEach(async (action) => {
        strapi
          .service('api::campaign-action.action')
          .run(action)
          .then(() => {
            console.log('Action run successfully: ', action.id);
          })
          .catch((err: any) => {
            console.log('Action run failed: ', action.id, err);
          });
      });
    },
  }),
);
