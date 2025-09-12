import { Context } from 'koa';

export default {
  async getStageStatistics(ctx: Context) {
    return await strapi
      .service('api::opportunity.opportunity')
      .getStageStatistics();
  },
};
