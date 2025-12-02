import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController(
  'api::telecom.telecom',
  ({ strapi }) => ({
    async sendSMS(ctx: Context) {
      const { to, body, module, recordId } = ctx.request.body;
      const user = ctx.state.user;

      const result = await strapi.service('api::telecom.sms').sendSMS({
        to,
        body,
        module,
        recordId,
        userId: user.id,
      });

      if (result.error) {
        ctx.status = 400;
        ctx.body = { error: result.error };
        return;
      }

      ctx.status = 200;
      ctx.body = result;
    },
  }),
);
