import { factories } from '@strapi/strapi';
import { parseSql } from '../../../helpers/utils';
import { ContentTypeType } from '../../metadata/types';

export default factories.createCoreService(
  'api::report.report',
  ({ strapi }) => ({
    async isValidQuery(query: string): Promise<boolean> {
      try {
        const result = await parseSql(query);

        for (const stmt of result.stmts) {
          if (!stmt.stmt || typeof stmt.stmt !== 'object') {
            return false;
          }

          if (!('SelectStmt' in stmt.stmt)) {
            return false;
          }

          const selectStmt: any = stmt.stmt.SelectStmt;
          if (!selectStmt.limitCount) {
            return false;
          }

          const limit = selectStmt.limitCount.A_Const?.ival?.ival || -1;
          if (
            !limit ||
            typeof limit !== 'number' ||
            limit <= 0 ||
            limit > 1000
          ) {
            return false;
          }
        }

        return true;
      } catch (error) {
        return false;
      }
    },

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
        const isValid = await this.isValidQuery(query);
        if (!isValid) {
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
