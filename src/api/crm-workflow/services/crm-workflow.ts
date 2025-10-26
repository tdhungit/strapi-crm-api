import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::crm-workflow.crm-workflow',
  ({ strapi }) => ({
    async run(workflowAction: any) {},

    async checkAndProcessWorkflow() {
      const workflowActions = await strapi.db
        .query('api::crm-workflow-action.crm-workflow-action')
        .findMany({
          where: {
            action_status: 'Queue',
            workflow: {
              workflow_status: 'Active',
              trigger: 'conditions',
            },
          },
          populate: {
            workflow: true,
          },
        });

      workflowActions.forEach(async (workflowAction) => {
        this.run(workflowAction)
          .then(() => {
            console.log(
              'Workflow run successfully: ',
              workflowAction.workflow.id,
            );
          })
          .catch((err: any) => {
            console.log(
              'Workflow run failed: ',
              workflowAction.workflow.id,
              err,
            );
          });
      });
    },
  }),
);
