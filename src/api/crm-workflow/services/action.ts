import {
  WorkflowActionRunResult,
  WorkflowActionType,
  WorkflowAddToCampaignActionType,
  WorkflowEmailActionType,
  WorkflowSmsActionType,
  WorkflowType,
} from '../types';

export default {
  getListActions() {
    // find all function in this object have end is Action
    return Object.keys(this)
      .filter((key) => key.endsWith('Action'))
      .map((key) => key.replace('Action', ''));
  },

  async saveActionHistory(
    workflow: WorkflowType,
    action: WorkflowActionType,
    record: any,
    status?: string,
    metadata?: Record<string, any>,
  ): Promise<any> {
    return await strapi.db
      .query('api::crm-workflow-history.crm-workflow-history')
      .create({
        data: {
          workflow_action: action.id,
          module: workflow.module,
          record_id: record.id,
          run_status: status || 'Completed',
          metadata: metadata || {},
        },
      });
  },

  async canRun(
    workflow: WorkflowType,
    action: WorkflowActionType,
    record: any,
  ): Promise<boolean> {
    if (action.is_repeat) {
      return true;
    }

    const history = await strapi.db
      .query('api::crm-workflow-history.crm-workflow-history')
      .findOne({
        where: {
          workflow_action: action.id,
          module: workflow.module,
          record_id: record.id,
        },
      });

    return !history;
  },

  async run(
    workflow: WorkflowType,
    action: WorkflowActionType,
    records: any[],
  ) {
    const actionName = action.name + 'Action';
    if (this[actionName]) {
      for await (const record of records) {
        if (await this.canRun(workflow, action, record)) {
          const res = await this[actionName](action, record, workflow);
          await this.saveActionHistory(
            workflow,
            action,
            record,
            res.status || 'Completed',
            res.metadata || {},
          );
        }
      }
    } else {
      console.log('Action not found...', actionName);
      return null;
    }
  },

  async Send_EmailAction(
    action: WorkflowActionType,
    record: any,
    workflow?: WorkflowType,
  ): Promise<WorkflowActionRunResult> {
    const metadata: WorkflowEmailActionType = action.metadata;
    const emailTemplateId = metadata.actionSettings?.templateId;
    const field = metadata.actionSettings?.field;
    if (!emailTemplateId || !field || !record[field]) {
      return {
        status: 'Failed',
        message: 'Missing required parameters',
        metadata,
      };
    }

    await strapi
      .service('api::email-template.email')
      .sendTemplate(record[field], emailTemplateId, record);

    return {
      status: 'Completed',
      metadata,
    };
  },

  async Send_SmsAction(
    action: WorkflowActionType,
    record: any,
    workflow?: WorkflowType,
  ): Promise<WorkflowActionRunResult> {
    const metadata: WorkflowSmsActionType = action.metadata;
    const smsTemplateId = metadata.actionSettings?.templateId;
    const field = metadata.actionSettings?.field;
    if (!smsTemplateId || !field || !record[field]) {
      return {
        status: 'Failed',
        message: 'Missing required parameters',
        metadata,
      };
    }

    let body = '';
    try {
      body = await strapi
        .service('api::email-template.email-template')
        .parseTemplateContent(smsTemplateId, record);
    } catch (error) {
      return {
        status: 'Failed',
        message: error.message || 'Error parsing template content',
        metadata,
      };
    }

    await strapi.service('api::telecom.sms').sendSms(record[field], body);

    return {
      status: 'Completed',
      metadata,
    };
  },

  async Add_To_CampaignAction(
    action: WorkflowActionType,
    record: any,
    workflow?: WorkflowType,
  ): Promise<WorkflowActionRunResult> {
    const metadata: WorkflowAddToCampaignActionType = action.metadata;
    const campaignId = metadata.actionSettings?.campaignId;
    if (!campaignId) {
      return {
        status: 'Failed',
        message: 'Missing required parameters',
        metadata,
      };
    }

    const campaign = await strapi.db.query('api::campaign.campaign').findOne({
      where: {
        id: campaignId,
      },
    });
    if (!campaign) {
      return {
        status: 'Failed',
        message: 'Campaign not found',
        metadata,
      };
    }

    switch (workflow?.module) {
      case 'contact':
        await strapi.db.query('api::campaign.campaign').update({
          where: {
            id: campaignId,
          },
          data: {
            contacts: {
              connect: {
                id: record.id,
              },
            },
          },
        });
        break;
      case 'lead':
        await strapi.db.query('api::campaign.campaign').update({
          where: {
            id: campaignId,
          },
          data: {
            leads: {
              connect: {
                id: record.id,
              },
            },
          },
        });
        break;
      default:
        break;
    }

    return {
      status: 'Completed',
      metadata: {},
    };
  },
};
