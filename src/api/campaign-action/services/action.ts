import {
  SendMailMultipleDataType,
  SendMailOptions,
} from '../../email-template/types';
import { ContentTypeType } from '../../metadata/types';
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
    if (!this[actionName]) {
      return {
        status: 'Failed',
        data: {
          message: 'Action not found',
        },
      };
    }

    // Update status = Running
    await strapi.db.query('api::campaign-action.campaign-action').update({
      where: {
        id: action.id,
      },
      data: {
        action_status: 'Running',
      },
    });

    const res: CampaignActionRunResult = await this.runAction(action);

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
  },

  async runAction(
    action: CampaignActionType,
    page: number = 1,
  ): Promise<CampaignActionRunResult> {
    const actionName = action.name + 'Action';
    if (!this[actionName]) {
      return {
        status: 'Failed',
        data: {
          message: 'Action not found',
        },
      };
    }

    const contentType: ContentTypeType = await strapi
      .service('api::metadata.metadata')
      .getContentTypeFromCollectionName('campaigns');

    const fieldOptions = contentType.attributes[action.field_name];
    const uid = fieldOptions.target;
    const limit = 100;
    const records = await strapi.db.query(uid).findMany({
      where: {
        campaign: action.campaign.id,
      },
      limit,
      offset: (page - 1) * limit,
    });

    if (records.length > 0) {
      await this[actionName](action, records, fieldOptions);
      return this.runAction(action, page + 1);
    }

    return {
      status: 'Completed',
      data: action,
    };
  },

  async Send_EmailAction(
    action: CampaignActionType,
    records: any[],
    fieldOptions: any,
  ) {
    const templateId = action.metadata?.actionSettings?.templateId;
    if (!templateId) {
      return;
    }

    const template = await strapi.db
      .query('api::email-template.email-template')
      .findOne({
        where: {
          id: templateId,
        },
      });

    if (!template) {
      return;
    }

    const options: SendMailOptions = {
      from: action.metadata?.actionSettings?.fromEmail,
      fromName: action.metadata?.actionSettings?.fromName,
      replyTo: action.metadata?.actionSettings?.replyToEmail,
      replyToName: action.metadata?.actionSettings?.replyToName,
      mailId: `campaign-action-${action.id}`,
      template: template,
    };

    const data: SendMailMultipleDataType[] = [];
    records.forEach((record) => {
      if (record[action.target_field_name]) {
        data.push({
          to: record[action.target_field_name],
          data: record,
        });
      }
    });

    await strapi
      .service('api::email-template.email')
      .sendBatches(templateId, data, options);

    // save history
    for await (const item of data) {
      await strapi.db.query('api::mail-history.mail-history').create({
        data: {
          title: template.title,
          body: '',
          email_template: template.id,
          from_email: options.from || '',
          to_email: item.to,
          source: 'campaign-actions',
          source_id: action.id,
          model: fieldOptions.target,
          record_id: item.data.id,
          service_sid: `campaign-action-${action.id}:${item.data.id}`,
          delivered: false,
          opened: 0,
          clicked: 0,
        },
      });
    }
  },
};
