import { factories } from '@strapi/strapi';
import { ContentTypeType } from '../../metadata/types';

export default factories.createCoreService(
  'api::report.report',
  ({ strapi }) => ({
    async generateReport(module: string, filters: any, query: string) {
      const contentType: ContentTypeType | null = await strapi
        .service('api::metadata.metadata')
        .getContentTypeFromCollectionName(module);

      if (!contentType) {
        throw new Error(`Content type not found for module: ${module}`);
      }

      return await strapi.entityService.findMany(contentType.uid as any, {
        filters,
      });
    },
  }),
);
