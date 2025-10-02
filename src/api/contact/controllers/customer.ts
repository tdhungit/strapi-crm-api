import { Context } from 'koa';

export default {
  async getLeadsAndContacts(ctx: Context) {
    const page: number = ctx.query.page
      ? parseInt(ctx.query.page as string, 10)
      : 1;
    const pageSize: number = ctx.query.pageSize
      ? parseInt(ctx.query.pageSize as string, 10)
      : 10;
    const start = (page - 1) * pageSize;
    const limit = pageSize;

    const { search } = ctx.query || {};

    const where = {};

    if (search) {
      Object.assign(where, {
        $or: [
          { firstName: { $containsi: search } },
          { lastName: { $containsi: search } },
          { email: { $containsi: search } },
          { phone: { $containsi: search } },
          { mobile: { $containsi: search } },
        ],
      });
    }

    const [leadTotals, contactTotals, leads, contacts] = await Promise.all([
      // Count leads
      strapi.db.query('api::lead.lead').count({
        where,
      }),
      // Count contacts
      strapi.db.query('api::contact.contact').count({
        where,
      }),
      // Fetch leads
      strapi.db.query('api::lead.lead').findMany({
        where,
        populate: { address: true, assigned_user: true, contact: true },
        orderBy: { createdAt: 'desc' },
        offset: start,
        limit,
      }),
      // Fetch contacts
      strapi.db.query('api::contact.contact').findMany({
        where,
        populate: { account: true, address: true, assigned_user: true },
        orderBy: { createdAt: 'desc' },
        offset: start,
        limit,
      }),
    ]);

    return {
      leads,
      contacts,
      leadMeta: {
        page,
        pageSize,
        total: leadTotals,
      },
      contactMeta: { page, pageSize, total: contactTotals },
    };
  },
};
