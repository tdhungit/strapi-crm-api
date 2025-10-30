import { Context } from 'koa';

export default {
  async verifyToken(token: string) {
    const settings = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'mail');
    const setting = settings?.mail || {};
    return setting?.SendGrid?.webhookToken === token;
  },

  async sendgridEvent(ctx: Context) {
    const token = ctx.query.token || '';
    const { event, X_Mail_ID } = ctx.request.body;

    if (!this.verifyToken(token as string)) {
      return ctx.throw(401, 'Unauthorized');
    }

    if (!event || !X_Mail_ID) {
      return ctx.throw(400, 'Invalid request');
    }

    // Search mail history
    const mailHistory = await strapi.db
      .query('api::mail-history.mail-history')
      .findOne({
        where: {
          service_sid: X_Mail_ID,
        },
      });

    if (!mailHistory) {
      return ctx.throw(404, 'Mail history not found');
    }

    // Update mail history
    await strapi.db.query('api::mail-history.mail-history').update({
      where: {
        id: mailHistory.id,
      },
      data: {
        mail_status: event,
        delivered: event === 'delivered' ? true : mailHistory.delivered,
        opened:
          event === 'opened' ? mailHistory.opened + 1 : mailHistory.opened,
        clicked:
          event === 'clicked' ? mailHistory.clicked + 1 : mailHistory.clicked,
      },
    });

    return ctx.send(200, 'OK');
  },
};
