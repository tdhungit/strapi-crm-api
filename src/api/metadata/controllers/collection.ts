import { Context } from 'koa';
import { ContentTypeType } from '../types';

export default {
  async bulkUpdateCollection(ctx: Context) {
    const { collectionName } = ctx.params;
    const { ids, data, filters } = ctx.request.body;

    if (!ids && !filters) {
      ctx.throw(400, 'ids and data are required');
      return;
    }

    const model: ContentTypeType = await strapi
      .service('api::metadata.metadata')
      .getContentTypeFromCollectionName(collectionName);

    if (!model) {
      ctx.throw(404, `Collection ${collectionName} not found`);
      return;
    }

    let filtersQuery = {};
    if (filters) {
      filtersQuery = {
        ...filters,
      };
    } else {
      filtersQuery = {
        id: {
          $in: ids,
        },
      };
    }

    if (model.attributes.assigned_user) {
      const assignFilter = await strapi
        .service('api::user.user')
        .generateAssignFilter(ctx.state.user.id, model, 'update', filtersQuery);
      filtersQuery = {
        $and: [filtersQuery, assignFilter],
      };
    }

    const entriesToUpdate = await strapi.db.query(model.uid).findMany({
      where: filtersQuery,
    });

    const updatePromises = entriesToUpdate.map(async (entry) => {
      return strapi.db.query(model.uid).update({
        where: { id: entry.id },
        data,
      });
    });

    const results = await Promise.all(updatePromises);

    return {
      results,
      ids,
      filters,
      data,
    };
  },
};
