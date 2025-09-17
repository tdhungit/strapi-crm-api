import { CampaignActionType } from '../types';

export default {
  async run(action: CampaignActionType) {
    if (this[action.name]) {
      console.log('Running action...', action.name);
      const actionName = action.name + 'Action';
      return this[actionName](action);
    } else {
      console.log('Action not found...', action.name);
    }
  },

  getListActions() {
    // find all function in this object have end is Action
    return Object.keys(this)
      .filter((key) => key.endsWith('Action'))
      .map((key) => key.replace('Action', ''));
  },

  async Send_EmailAction(action: CampaignActionType) {
    console.log('Sending email...', action);
  },
};
