import { Context } from 'koa';

export default {
  async sendSMS(ctx: Context) {
    const { to, body, module, recordId } = ctx.request.body;
    const user = ctx.state.user;

    if (!to || !body) {
      ctx.status = 400;
      ctx.body = { error: 'Missing to or body' };
      return;
    }

    return await strapi
      .service('api::telecom.twilio')
      .sendSMS({ to, body }, user.id, module, recordId);
  },

  async smsHandler(ctx: Context) {
    return await strapi
      .service('api::telecom.twilio')
      .receiveSMS(ctx.request.body);
  },

  async getToken(ctx: Context) {
    const { identity, workspaceSid, workerSid } = ctx.request.body;

    if (!identity) {
      ctx.status = 400;
      ctx.body = { error: 'Missing identity' };
      return;
    }

    const token = await strapi
      .service('api::telecom.twilio')
      .getAccessToken(identity, workspaceSid, workerSid);

    return { token };
  },

  async voiceHandler(ctx: Context) {
    return await strapi
      .service('api::telecom.twilio')
      .voiceHandler(ctx.request.body);
  },

  async statusHandler(ctx: Context) {
    return await strapi
      .service('api::telecom.twilio')
      .statusCallback(ctx.request.body);
  },

  async assignmentHandler(ctx: Context) {
    return await strapi
      .service('api::telecom.twilio')
      .taskrouterAssignmentCallback(ctx.request.body);
  },

  async dequeueHandler(ctx: Context) {
    return await strapi
      .service('api::telecom.twilio')
      .dequeueStatusCallback(ctx.request.body);
  },
};
