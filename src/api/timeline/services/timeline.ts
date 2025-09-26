import { factories } from '@strapi/strapi';
import { TimelineSaveType } from './../types';

export default factories.createCoreService(
  'api::timeline.timeline',
  ({ strapi }) => ({
    async saveTimeline(data: TimelineSaveType) {
      const timeline = await strapi.db.query('api::timeline.timeline').create({
        data: {
          title: data.title,
          description: data.description || '',
          model: data.model,
          record_id: data.recordId || null,
          createdBy: data.user?.id || null,
          updatedBy: data.user?.id || null,
          user: data.user?.id || null,
          metadata: data.metadata || {},
        },
      });
      return timeline;
    },
  })
);
