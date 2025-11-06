import { Context } from 'koa';

export default {
  async createOrUpdate(ctx: Context) {
    const { body } = ctx.request;

    if (!body?.email || !body?.firstName || !body?.lastName) {
      return ctx.badRequest('Email, First Name, and Last Name are required');
    }

    let contact = await strapi.db.query('api::contact.contact').findOne({
      where: {
        email: body.email,
      },
    });

    const data = strapi
      .service('api::metadata.metadata')
      .fixDataSave('api::contact.contact', body);

    if (contact) {
      contact = await strapi.db.query('api::contact.contact').update({
        where: {
          id: contact.id,
        },
        data,
      });
      ctx.status = 200;
      ctx.body = contact;
      return;
    }

    contact = await strapi.db.query('api::contact.contact').create({
      data,
    });

    ctx.status = 201;
    ctx.body = contact;
  },
};
