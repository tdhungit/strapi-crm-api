import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::opportunity.opportunity',
  ({ strapi }) => ({
    async getStageStatistics(): Promise<any> {
      // Define all possible stages from the schema enum
      const allStages = [
        'Prospecting',
        'Qualification',
        'Needs Analysis',
        'Value Proposition',
        'Identifying Decision Makers',
        'Perception Analysis',
        'Proposal',
        'Negotiation',
        'Closed Won',
        'Closed Lost',
      ];

      // Initialize all stages with 0 count
      const stageCounts = allStages.reduce(
        (acc, stage) => {
          acc[stage] = 0;
          return acc;
        },
        {} as Record<string, number>
      );

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

      // Count existing opportunities by stage
      opportunities.forEach((opportunity) => {
        if (
          opportunity.stage &&
          stageCounts.hasOwnProperty(opportunity.stage)
        ) {
          stageCounts[opportunity.stage]++;
        }
      });

      return stageCounts;
    },
  })
);
