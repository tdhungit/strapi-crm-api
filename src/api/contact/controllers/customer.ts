import { Context } from 'koa';
import { hashPassword } from '../../../helpers/utils';

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

  async checkContactEmailExist(ctx: Context) {
    const { email } = ctx.request.body;

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { email },
    });

    if (contact) {
      return ctx.badRequest('Email already exists');
    }

    return { email };
  },

  async contactRegister(ctx: Context) {
    const {
      email,
      password,
      salutation,
      firstName,
      lastName,
      phone,
      mobile,
      address,
      leadSource,
    } = ctx.request.body;

    if (!email || !password || !firstName || !lastName || !phone) {
      throw new Error(
        'Missing required fields: email, password, firstName, lastName, phone',
      );
    }

    const contact = await strapi.db.query('api::contact.contact').create({
      data: {
        salutation,
        email,
        password: hashPassword(password),
        firstname: firstName,
        lastname: lastName,
        phone,
        mobile,
        address,
        leadSource: leadSource || 'Website',
      },
    });

    return contact;
  },

  async contactLogin(ctx: Context) {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      throw new Error('Missing required fields: email, password');
    }

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { email },
    });

    if (!contact) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = false;

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return contact;
  },
};
