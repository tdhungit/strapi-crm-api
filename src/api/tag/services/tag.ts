import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::tag.tag', ({ strapi }) => ({
  async getRecordTags(module: string, recordId: number) {
    const relations = await strapi.db
      .query('api::tag-assignment.tag-assignment')
      .findMany({
        where: { module, record_id: recordId },
        populate: { tag: true },
      });

    return relations.map((relation) => relation.tag);
  },
}));
