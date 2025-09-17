import { CampaignActionType } from '../types';

export default {
  async run(action: CampaignActionType) {
    if (this[action.name]) {
      console.log('Running action...', action.name);
      return this[action.name](action);
    } else {
      console.log('Action not found...', action.name);
    }
  },

  async sendEmail(action: CampaignActionType) {
    console.log('Sending email...', action);
  },
};
