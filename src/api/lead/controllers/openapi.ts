import { Context } from 'koa';

export default {
  async createOrUpdateLead(ctx: Context) {
    const { body } = ctx.request;

    if (!body.email || !body.firstName || !body.lastName) {
      return ctx.throw(400, 'Email, First Name, and Last Name are required');
    }

    const data = strapi
      .service('api::metadata.metadata')
      .fixDataSave('api::lead.lead', body);

    let lead = await strapi.db.query('api::lead.lead').findOne({
      where: {
        email: body.email,
      },
    });

    if (lead) {
      lead = await strapi.db.query('api::lead.lead').update({
        where: {
          id: lead.id,
        },
        data,
      });
    } else {
      lead = await strapi.db.query('api::lead.lead').create({
        data,
      });
    }

    ctx.body = lead;
  },
};
