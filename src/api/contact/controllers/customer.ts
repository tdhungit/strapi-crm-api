import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { comparePassword, hashPassword } from '../../../helpers/utils';

export default {
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

  async getFirebaseConfig(ctx: Context) {
    const firebaseConfig = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'firebase');
    return firebaseConfig.firebase || {};
  },
};
