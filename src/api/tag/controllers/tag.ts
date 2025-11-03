import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController('api::tag.tag', ({ strapi }) => ({
  async create(ctx: Context) {
    const { data: body } = ctx.request.body;
    const { name, module, recordId } = body || {};

    let data: any;
    let meta: any = {};

    // Check exist name
    const existingTag = await strapi.db
      .query('api::tag.tag')
      .findOne({ where: { name } });
    if (existingTag) {
      data = existingTag;
    } else {
      data = await strapi.db
        .query('api::tag.tag')
        .create({ data: { name, user: ctx.state.user.id } });
    }

    if (module && recordId) {
      // check tag assignment exist
      const assignment = await strapi.db
        .query('api::tag-assignment.tag-assignment')
        .findOne({ where: { tag: data.id, module, recordId } });

      if (!assignment) {
        // create tag assignment
        await strapi.db.query('api::tag-assignment.tag-assignment').create({
          data: {
            tag: data.id,
            module,
            recordId,
          },
        });
      }
    }

    return { data, meta };
  },

  async delete(ctx: Context) {
    const { id } = ctx.params;

    // delete tag assignment
    await strapi.db.query('api::tag-assignment.tag-assignment').deleteMany({
      where: { tag: id },
    });

    return await super.delete(ctx);
  },

  async assign(ctx: Context) {
    const { module, recordId, tagNames } = ctx.request.body;

    // delete old tag assignments
    await strapi.db.query('api::tag-assignment.tag-assignment').deleteMany({
      where: { module, record_id: parseInt(recordId) },
    });

    for await (const tagName of tagNames) {
      let tag = await strapi.db
        .query('api::tag.tag')
        .findOne({ where: { name: tagName } });

      if (!tag) {
        tag = await strapi.db
          .query('api::tag.tag')
          .create({ data: { name: tagName, user: ctx.state.user.id } });
      }

      const tagId = tag.id;

      // check tag assignment exist
      const assignment = await strapi.db
        .query('api::tag-assignment.tag-assignment')
        .findOne({
          where: { tag: tagId, module, record_id: parseInt(recordId) },
        });

      if (!assignment) {
        // create tag assignment
        await strapi.db.query('api::tag-assignment.tag-assignment').create({
          data: {
            tag: tagId,
            module,
            record_id: parseInt(recordId),
          },
        });
      }
    }

    return { success: true };
  },

  async getRecordTags(ctx: Context) {
    const { module, recordId } = ctx.params;

    return await strapi.service('api::tag.tag').getRecordTags(module, recordId);
  },
}));
