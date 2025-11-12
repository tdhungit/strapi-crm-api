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

      if (!item.metadata.query) {
        return {};
      }

      const query = item.metadata.query;
      // Check query is select
      const isSelect = await isSelectQuery(query);
      if (!isSelect) {
        return {};
      }

      const knex = strapi.db.connection;
      return await knex.raw(query);
    },
  }),
);
