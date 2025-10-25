import { CampaignActionRunResult, CampaignActionType } from '../types';

export default {
  async run(action: CampaignActionType): Promise<CampaignActionRunResult> {
    const actionName = action.name + 'Action';
    if (this[actionName]) {
      console.log('Running action...', actionName);
      const res: CampaignActionRunResult = await this[actionName](action);
      return res;
    } else {
      console.log('Action not found...', actionName);
      return {
        status: 'Failed',
        data: null,
      };
    }
  },

  getListActions() {
    // find all function in this object have end is Action
    return Object.keys(this)
      .filter((key) => key.endsWith('Action'))
      .map((key) => key.replace('Action', ''));
  },

  async Send_EmailAction(
    action: CampaignActionType,
  ): Promise<CampaignActionRunResult> {
    console.log('Sending email...', action);
    return {
      status: 'Running',
      data: action,
    };
  },
};
