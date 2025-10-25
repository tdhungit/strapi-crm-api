import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::crm-workflow.crm-workflow',
  ({ strapi }) => ({
    async run(workflow: any) {},

    async checkAndProcessWorkflow() {
      const workflows = await strapi.db
        .query('api::crm-workflow.crm-workflow')
        .findMany({
          where: {
            workflow_status: 'Ready',
            trigger: 'conditions',
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
