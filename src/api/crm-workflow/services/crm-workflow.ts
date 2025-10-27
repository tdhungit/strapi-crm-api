import { factories } from '@strapi/strapi';
import { ContentTypeType } from '../../metadata/types';
import { WorkflowConditionType, WorkflowType } from './../types';

export default factories.createCoreService(
  'api::crm-workflow.crm-workflow',
  ({ strapi }) => ({
    async getWorkflowConditionsRecords(workflow: WorkflowType): Promise<any[]> {
      interface WorkflowConditionGroupType {
        conditions: WorkflowConditionType[];
        operator: string;
      }

      const conditions: WorkflowConditionGroupType[] =
        workflow.metadata?.conditions || [];
      if (!conditions.length) {
        return [];
      }

      const contentType: ContentTypeType | null = await strapi
        .service('api::metadata.metadata')
        .getContentTypeFromCollectionName(workflow.module);
      if (!contentType) {
        return [];
      }

      const where = {};
      conditions.forEach((condition) => {
        const groupOperator = '$' + (condition.operator || 'and');
        where[groupOperator] = [];
        condition.conditions.forEach((c) => {
          const operator = '$' + (c.operator || 'eq');
          where[groupOperator].push({
            [c.field]: {
              [operator]: c.value,
            },
          });
        });
      });

      if (Object.keys(where).length === 0) {
        return [];
      }

      const uid = contentType.uid;
      return await strapi.db.query(uid).findMany({
        where,
      });
    },

    async run(workflow: WorkflowType) {
      // Update status workflow to running
      await strapi.db.query('api::crm-workflow.crm-workflow').update({
        where: {
          id: workflow.id,
        },
        data: {
          run_status: 'Running',
        },
      });

      const records = await this.getWorkflowConditionsRecords(workflow);

      // Run workflow actions
      for await (const action of workflow.workflow_actions) {
        await strapi
          .service('api::crm-workflow-action.crm-workflow-action')
          .run(workflow, action, records);
      }

      // Update status workflow to ready
      await strapi.db.query('api::crm-workflow.crm-workflow').update({
        where: {
          id: workflow.id,
        },
        data: {
          run_status: 'Ready',
        },
      });
    },

    async checkAndProcessWorkflow() {
      const workflows = await strapi.db
        .query('api::crm-workflow.crm-workflow')
        .findMany({
          where: {
            run_status: 'Ready',
            workflow_status: 'Active',
            trigger: 'conditions',
            run_at: {
              $lte: new Date(),
            },
          },
          populate: {
            workflow_actions: {
              filters: {
                action_status: 'Active',
              },
            },
          },
        });

      workflows.forEach(async (workflow) => {
        this.run(workflow)
          .then(() => {
            console.log('Workflow run successfully: ', workflow.id);
          })
          .catch((err: any) => {
            console.log('Workflow run failed: ', workflow.id, err);
          });
      });
    },
  }),
);
