import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController(
  'api::telecom.telecom',
  ({ strapi }) => ({
    async sendSMS(ctx: Context) {
      const settings = await strapi
        .service('api::setting.setting')
        .getCRMSettings();

      const { telecomProvider } = settings;
      if (!telecomProvider) {
        ctx.status = 400;
        ctx.body = { error: 'Missing required parameters' };
        return;
      }

      const { to, body, module, recordId } = ctx.request.body;
      const user = ctx.state.user;

      if (!to || !body) {
        ctx.status = 400;
        ctx.body = { error: 'Missing required parameters' };
        return;
      }

      if (telecomProvider === 'twilio') {
        return await strapi
          .service('api::telecom.twilio')
          .sendSMS({ to, body }, user.id, module, recordId);
      }

      ctx.status = 400;
      ctx.body = { error: 'Unsupported telecom provider' };
    },
  }),
);
