import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::opportunity.opportunity',
  ({ strapi }) => ({
    async getStageStatistics(): Promise<any> {
      const opportunities = await strapi.entityService.findMany(
        'api::opportunity.opportunity',
        {
          fields: ['stage'],
          filters: {
            stage: {
              $notNull: true,
            },
          },
        }
      );

      const stages = opportunities.map((opportunity) => opportunity.stage);

      const stageCounts = stages.reduce((acc, stage) => {
        if (acc[stage]) {
          acc[stage]++;
        } else {
          acc[stage] = 1;
        }
        return acc;
      }, {});

      return stageCounts;
    },
  })
);
