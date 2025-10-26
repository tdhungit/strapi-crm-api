import { CampaignActionRunResult, CampaignActionType } from '../types';

export default {
  getListActions() {
    // find all function in this object have end is Action
    return Object.keys(this)
      .filter((key) => key.endsWith('Action'))
      .map((key) => key.replace('Action', ''));
  },

  async run(action: CampaignActionType): Promise<CampaignActionRunResult> {
    const actionName = action.name + 'Action';
    if (this[actionName]) {
      // Update status = Running
      await strapi.db.query('api::campaign-action.campaign-action').update({
        where: {
          id: action.id,
        },
        data: {
          action_status: 'Running',
        },
      });

      const res: CampaignActionRunResult = await this[actionName](action);

      // Update status campaign action
      await strapi.db.query('api::campaign-action.campaign-action').update({
        where: {
          id: action.id,
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
            action_id: action.id,
            run_status: res.status,
            metadata: JSON.stringify(res.data),
          },
        });

      return res;
    } else {
      console.log('Action not found...', actionName);
      return {
        status: 'Failed',
        data: null,
      };
    }
  },

  async Send_EmailAction(
    action: CampaignActionType,
  ): Promise<CampaignActionRunResult> {
    console.log('Sending email...', action);
    return {
      status: 'Completed',
      data: action,
    };
  },
};
