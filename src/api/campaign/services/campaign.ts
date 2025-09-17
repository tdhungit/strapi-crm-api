import { factories } from '@strapi/strapi';
import { CampaignActionType } from '../../campaign-action/types';
import { CampaignType } from './../types';

export default factories.createCoreService('api::campaign.campaign', () => ({
  async sendMail(
    actionName: string,
    campaign: CampaignType,
    user: any,
    options: {
      field: string;
      emailField: string;
      templateId: number;
      runNow: boolean;
    }
  ) {
    // save to campaign action
    const actionData: CampaignActionType = {
      name: actionName,
      campaign: campaign.id,
      user: user.id,
      field_name: options.field,
      target_field_name: options.emailField,
      action_status: 'Ready',
      metadata: {
        templateId: options.templateId,
      },
    };
    const action = await strapi.db
      .query('api::campaign-action.campaign-action')
      .create({
        data: actionData,
      });

    if (options.runNow) {
      strapi
        .service('api::campaign-action.campaign-action')
        .runAction(action.id);
    }
  },
}));
