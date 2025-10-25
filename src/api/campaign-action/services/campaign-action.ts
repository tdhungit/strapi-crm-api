import { factories } from '@strapi/strapi';
import { CampaignActionRunResult } from '../types';

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

      if (!action) {
        throw new Error('Action not found');
      }

      const res: CampaignActionRunResult = await strapi
        .service('api::campaign-action.action')
        .run(action);

      // Update status
      await strapi.db.query('api::campaign-action.campaign-action').update({
        where: {
          id: actionId,
        },
        data: {
          action_status: res.status,
        },
      });

      // Save to campaign action history
      await strapi.db
        .query('api::campaign-action-history.campaign-action-history')
        .create({
          data: {
            action_id: actionId,
            run_status: res.status,
            metadata: JSON.stringify(res.data),
          },
        });

      return res;
    },
  }),
);
