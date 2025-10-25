import { factories } from '@strapi/strapi';
import {
  SendMailMultipleDataType,
  SendMailOptions,
} from '../../email-template/types';
import { CampaignActionType } from './../../campaign-action/types';

export default factories.createCoreService('api::campaign.campaign', () => ({
  async sendMail(action: CampaignActionType) {
    const templateId = action.metadata?.actionSettings?.templateId;
    const options: SendMailOptions = {
      from: action.metadata?.actionSettings?.fromEmail,
      fromName: action.metadata?.actionSettings?.fromName,
      replyTo: action.metadata?.actionSettings?.replyToEmail,
      replyToName: action.metadata?.actionSettings?.replyToName,
    };

    if (!templateId) {
      throw new Error('Template ID is required');
    }

    let data: SendMailMultipleDataType[] = [];
    switch (action.field_name) {
      case 'leads':
        const leads = await strapi.db.query('api::lead.lead').findMany({
          where: {
            campaigns: {
              id: action.campaign.id,
            },
          },
        });

        leads.forEach((lead) => {
          if (lead[action.target_field_name]) {
            data.push({
              to: lead[action.target_field_name],
              data: lead,
            });
          }
        });
        break;
      case 'contacts':
        const contacts = await strapi.db
          .query('api::contact.contact')
          .findMany({
            where: {
              campaigns: {
                id: action.campaign.id,
              },
            },
          });

        contacts.forEach((contact) => {
          if (contact[action.target_field_name]) {
            data.push({
              to: contact[action.target_field_name],
              data: contact,
            });
          }
        });
        break;
      default:
        break;
    }

    await strapi
      .service('api::email-template.email')
      .sendBatches(templateId, data, options);
  },
}));
