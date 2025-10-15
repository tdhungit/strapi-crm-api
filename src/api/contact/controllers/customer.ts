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
      login_provider,
      login_provider_id,
      avatar,
      firebaseToken,
    } = ctx.request.body;

    if (!email || !firstName || !lastName) {
      throw new Error(
        'Missing required fields: email, password, firstName, lastName, phone',
      );
    }

    // Check if email already exists
    const contactExist = await strapi.db.query('api::contact.contact').findOne({
      where: { email },
    });

    if (contactExist) {
      if (autoLogin) {
        if (
          firebaseToken &&
          login_provider === contactExist.login_provider &&
          login_provider_id === contactExist.login_provider_id
        ) {
          return {
            contact: contactExist,
            token: strapi
              .service('api::contact.contact')
              .generateLoginToken(contactExist, firebaseToken),
          };
        }

        if (firebaseToken && login_provider && login_provider_id) {
          return {
            code: 'confirm_merge',
            login_provider,
            login_provider_id,
            firebaseToken,
          };
        }
      }

      return ctx.badRequest('Email already exists');
    }

    const contactData: any = {
      salutation,
      email,
      password: password ? hashPassword(password) : '',
      firstName: firstName,
      lastName: lastName,
      phone,
      mobile,
      address,
      leadSource: leadSource || 'Website',
      login_provider: login_provider || 'Local',
      login_provider_id,
      avatar,
    };

    // Get lead from email
    const lead = await strapi.db.query('api::lead.lead').findOne({
      where: { email },
    });
    if (lead?.id) {
      contactData.lead = lead.id;
      // Update status lead to converted
      await strapi.db.query('api::lead.lead').update({
        where: { id: lead.id },
        data: { status: 'Converted' },
      });
    }

    const contact = await strapi.db.query('api::contact.contact').create({
      data: contactData,
    });

    let token: string = '';
    if (autoLogin) {
      // generate token
      token = strapi
        .service('api::contact.contact')
        .generateLoginToken(contact);
    }

    return {
      ...contact,
      token,
    };
  },

  async contactMergeSocial2Local(ctx: Context) {
    const { login_provider, login_provider_id, firebaseToken } =
      ctx.request.body;
    if (!login_provider || !login_provider_id || !firebaseToken) {
      return ctx.badRequest(
        'Missing required fields: login_provider, login_provider_id, firebaseToken',
      );
    }

    const token = await strapi
      .service('api::contact.contact')
      .mergeSocial2Local(login_provider, login_provider_id, firebaseToken);

    if (token) {
      return { token };
    } else {
      return ctx.badRequest('Invalid Firebase token');
    }
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
    const token = await strapi
      .service('api::contact.contact')
      .generateLoginToken(contact);

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
    const config = firebaseConfig.firebase || {};
    delete config.serviceAccountJson;
    return config;
  },
};
