import { factories } from '@strapi/strapi';
import { isSelectQuery } from '../../../helpers/utils';
import { ContentTypeType } from '../../metadata/types';

export default factories.createCoreService(
  'api::report.report',
  ({ strapi }) => ({
    async generateReport(
      module: string,
      filters: any,
      query: string,
      options?: { page?: number; pageSize?: number },
    ) {
      const contentType: ContentTypeType | null = await strapi
        .service('api::metadata.metadata')
        .getContentTypeFromCollectionName(module);

      if (!contentType) {
        throw new Error(`Content type not found for module: ${module}`);
      }

      if (!filters && query) {
        const isSelect = await isSelectQuery(query);
        if (!isSelect) {
          return {
            data: [],
            meta: {},
          };
        }

        const knex = strapi.db.connection;
        const data = await knex.raw(query);
        return {
          data: data.rows,
          meta: {
            fields: data.fields,
            pagination: {
              page: 1,
              pageSize: data.rowCount,
              pageCount: 1,
              total: data.rowCount,
            },
          },
        };
      }

      const page = options?.page || 1;
      const pageSize = options?.pageSize || 20;

      const [result, count] = await Promise.all([
        strapi.entityService.findMany(contentType.uid as any, {
          filters,
          limit: pageSize,
          start: page && pageSize ? (page - 1) * pageSize : 0,
        }),
        strapi.db.query(contentType.uid as any).count({ where: filters }),
      ]);

      return {
        data: result,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: Math.ceil(count / pageSize),
            total: count,
          },
        },
      };
    },
  }),
);
