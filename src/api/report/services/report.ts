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

    async generateReportFromQuery(module: string, query: string) {
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
    },

    async generateReportFromFilters(
      contentType: ContentTypeType,
      filters: any,
      options?: { page?: number; pageSize?: number },
    ) {
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

    async generateReportFromJsonLogic(
      contentType: ContentTypeType,
      jsonLogic: any,
      options?: any,
    ) {
      const knex = strapi.db.connection;

      const query = knex(contentType.info.pluralName);

      const selectColumns: string[] = [];
      if (options?.xAxis) {
        selectColumns.push(options.xAxis);
      }

      // get select
      if (options?.yAxis && options?.metricOperation) {
        if (knex[options.metricOperation]) {
          query.select(
            knex[options.metricOperation](options.yAxis).as(
              options.metricOperation + '_' + options.yAxis,
            ),
          );
          // group by
          query.groupBy(options.yAxis);
        }
      } else if (options?.yAxis) {
        selectColumns.push(options.yAxis);
      }

      if (selectColumns.length === 0) {
        query.select('*');
      } else {
        query.select(selectColumns);
      }

      query.modify(this.toKnexQuery(jsonLogic));

      // group by
      if (options?.xAxis) {
        query.groupBy(options.xAxis);
      }

      const data = await query;

      return {
        data,
        meta: {
          pagination: {
            page: 1,
            pageSize: 20,
            pageCount: 1,
            total: 0,
          },
        },
      };
    },

    async generateReport(
      module: string,
      filters: any,
      query: string,
      options?: { page?: number; pageSize?: number; [key: string]: any },
      jsonLogic?: any,
    ) {
      const contentType: ContentTypeType | null = await strapi
        .service('api::metadata.metadata')
        .getContentTypeFromCollectionName(module);

      if (!contentType) {
        throw new Error(`Content type not found for module: ${module}`);
      }

      if (!filters && query) {
        return await this.generateReportFromQuery(module, query);
      }

      if (jsonLogic) {
        return await this.generateReportFromJsonLogic(
          contentType,
          jsonLogic,
          options,
        );
      }

      if (filters) {
        return await this.generateReportFromFilters(
          contentType,
          filters,
          options,
        );
      }
    },

    toKnexQuery(jsonLogic: any) {
      return (builder: any) => {
        if (!jsonLogic) return builder;
        const logic = jsonLogic.logic || jsonLogic;
        this.applyJsonLogicToKnex(builder, logic);
        return builder;
      };
    },

    applyJsonLogicToKnex(builder: any, logic: any) {
      if (!logic) return;

      const getFieldPath = (varObj: any): string => {
        if (typeof varObj === 'string') return varObj;
        if (varObj && varObj.var) return varObj.var;
        return '';
      };

      // Handle logical operators
      if (logic['and']) {
        builder.where((subBuilder: any) => {
          logic['and'].forEach((item: any) => {
            this.applyJsonLogicToKnex(subBuilder, item);
          });
        });
        return;
      }

      if (logic['or']) {
        builder.where((subBuilder: any) => {
          logic['or'].forEach((item: any, index: number) => {
            if (index === 0) {
              this.applyJsonLogicToKnex(subBuilder, item);
            } else {
              subBuilder.orWhere((innerBuilder: any) => {
                this.applyJsonLogicToKnex(innerBuilder, item);
              });
            }
          });
        });
        return;
      }

      if (logic['!']) {
        builder.whereNot((subBuilder: any) => {
          this.applyJsonLogicToKnex(subBuilder, logic['!']);
        });
        return;
      }

      // Handle basic operators
      const operators: Record<string, string> = {
        '==': '=',
        '!=': '<>',
        '>': '>',
        '>=': '>=',
        '<': '<',
        '<=': '<=',
      };

      for (const [op, sqlOp] of Object.entries(operators)) {
        if (logic[op]) {
          const [field, value] = logic[op];
          const fieldPath = getFieldPath(field);
          if (fieldPath) {
            builder.where(fieldPath, sqlOp, value);
          }
          return;
        }
      }

      if (logic['in']) {
        const [searchValue, target] = logic['in'];

        // Check if target is a variable (field reference) -> Contains
        if (target && typeof target === 'object' && target.var) {
          const fieldPath = getFieldPath(target);
          builder.where(fieldPath, 'like', `%${searchValue}%`);
          return;
        }

        // Otherwise, treat as field IN array of values
        const fieldPath = getFieldPath(searchValue);
        if (fieldPath) {
          builder.whereIn(fieldPath, target);
        }
        return;
      }
    },
  }),
);
