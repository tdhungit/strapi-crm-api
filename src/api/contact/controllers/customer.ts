import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { comparePassword, hashPassword } from '../../../helpers/utils';

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
      autoLogin = false,
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
        firstName: firstName,
        lastName: lastName,
        phone,
        mobile,
        address,
        leadSource: leadSource || 'Website',
      },
    });

    let token: string = '';
    if (autoLogin) {
      // generate token
      token = jwt.sign(
        { id: contact.id, email: contact.email },
        process.env.JWT_SECRET_CONTACT as string,
        {
          expiresIn: '24h',
        },
      );
    }

    return {
      ...contact,
      token,
    };
  },

  async contactLogin(ctx: Context) {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      return ctx.badRequest('Missing required fields: email, password');
    }

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { email },
    });

    if (!contact) {
      return ctx.badRequest('Invalid email or password');
    }

    if (!contact.password) {
      return ctx.badRequest('Password not set');
    }

    const isPasswordValid = comparePassword(password, contact.password);

    if (!isPasswordValid) {
      return ctx.badRequest('Invalid email or password');
    }

    // generate token
    const token = jwt.sign(
      { id: contact.id, email: contact.email },
      process.env.JWT_SECRET_CONTACT as string,
      {
        expiresIn: '24h',
      },
    );

    return { jwt: token };
  },

  async contactCurrent(ctx: Context) {
    const { id } = ctx.state.contact;

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { id },
    });

    if (!contact) {
      return ctx.badRequest('Invalid user');
    }

    delete contact.password;
    return contact;
  },

  async changePassword(ctx: Context) {
    const { id } = ctx.state.contact;
    const { oldPassword, newPassword } = ctx.request.body;

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { id },
    });

    if (!contact) {
      return ctx.badRequest('Invalid user');
    }

    const isPasswordValid = comparePassword(oldPassword, contact.password);

    if (!isPasswordValid) {
      return ctx.badRequest('Invalid old password');
    }

    await strapi.db.query('api::contact.contact').update({
      where: { id },
      data: {
        password: hashPassword(newPassword),
      },
    });

    return { message: 'Password changed successfully' };
  },
};
