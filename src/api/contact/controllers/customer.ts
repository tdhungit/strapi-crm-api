import { SupabaseClient } from '@supabase/supabase-js';
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
          login_provider_id === contactExist.login_provider_sid
        ) {
          const token = await strapi
            .service('api::contact.contact')
            .generateLoginToken(contactExist, firebaseToken);
          return {
            contact: contactExist,
            token,
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
      login_provider_sid: login_provider_id,
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
      token = await strapi
        .service('api::contact.contact')
        .generateLoginToken(contact);
    }

    return {
      ...contact,
      token,
    };
  },

  async contactRegisterFromSupabase(ctx: Context) {
    const { accessToken: token, login_provider } = ctx.request.body;

    if (!token) {
      return ctx.badRequest('Missing required fields: token');
    }

    const supabase: SupabaseClient = await strapi
      .service('api::setting.supabase')
      .getApp();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      return ctx.badRequest('Invalid token');
    }

    if (!user) {
      return ctx.badRequest('User not found');
    }

    let code = 'new';
    let contact = await strapi.db.query('api::contact.contact').findOne({
      where: { email: user.email },
    });

    if (!contact) {
      code = 'new';
      contact = await strapi.db.query('api::contact.contact').create({
        data: {
          email: user.email,
          login_provider: login_provider,
          login_provider_sid: user.id,
        },
      });
    } else {
      code = 'confirm_merge';
      if (
        contact.login_provider === login_provider &&
        contact.login_provider_sid === user.id
      ) {
        code = 'exist';
      }
    }

    const appToken = await strapi
      .service('api::contact.contact')
      .generateLoginToken(contact);

    return {
      code,
      token: appToken,
      sid: user.id,
    };
  },

  async contactMergeSocial2Local(ctx: Context) {
    const { login_provider, login_provider_id, token, authService } =
      ctx.request.body;
    if (!login_provider || !login_provider_id || !authService || !token) {
      return ctx.badRequest(
        'Missing required fields: login_provider, login_provider_id, authService, token',
      );
    }

    const appToken = await strapi
      .service('api::contact.contact')
      .mergeSocial2Local(authService, login_provider, login_provider_id, token);

    if (appToken) {
      return { token: appToken };
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

  async getECommerceConfig(ctx: Context) {
    const eCommerceConfig = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'ecommerce');
    const config = eCommerceConfig.ecommerce || {};

    if (config.authService === 'firebase') {
      const firebaseConfig = await strapi
        .service('api::setting.setting')
        .getSettings('system', 'firebase');
      const firebaseConfigData = firebaseConfig.firebase || {};
      delete firebaseConfigData.serviceAccountJson;
      config.firebase = firebaseConfigData;
    } else if (config.authService === 'supabase') {
      const supabaseConfig = await strapi
        .service('api::setting.setting')
        .getSettings('system', 'supabase');
      const supabaseConfigData = supabaseConfig.supabase || {};
      config.supabase = supabaseConfigData;
    }

    return config;
  },

  async getChatBoxConfig(ctx: Context) {
    const chatboxConfig = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'chatbox');
    const config = chatboxConfig.chatbox || {};
    return config;
  },
};
