import { factories } from '@strapi/strapi';
import { isSelectQuery } from '../../../helpers/utils';
import { DashboardItemType } from '../../dashboard/types';

export default factories.createCoreService(
  'api::dashboard-item.dashboard-item',
  ({ strapi }) => ({
    async getQueryResult(item: DashboardItemType) {
      if (item.type !== 'Query') {
        return {};
      }

      if (!item.metadata.query && !item.metadata.metadata?.query) {
        return {};
      }

      const query = item.metadata.query || item.metadata.metadata?.query;
      // Check query is select
      const isSelect = await isSelectQuery(query);
      if (!isSelect) {
        return {};
      }

      const knex = strapi.db.connection;
      return await knex.raw(query);
    },

    async getFilterBuilderResult(item: DashboardItemType) {
      if (item.type !== 'Builder') {
        return {};
      }

      if (!item.metadata.module) {
        return {};
      }

      if (!item.metadata.jsonLogic && !item.metadata.metadata?.jsonLogic) {
        return {};
      }

      const jsonLogic =
        item.metadata.jsonLogic || item.metadata.metadata?.jsonLogic;
      const module = item.metadata.module;

      const contentType = await strapi
        .service('api::metadata.metadata')
        .getContentTypeFromCollectionName(module);
      if (!contentType) {
        return {};
      }

      return strapi.service('api::report.report').generateReport(
        module,
        null,
        null,
        {
          ...(item.metadata.metadata || {}),
        },
        jsonLogic,
      );
    },
  }),
);
