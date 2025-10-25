import { SendMailOptions } from '../types';

export default () => ({
  async getMailServices() {
    return [
      {
        name: 'SendGrid',
        value: 'SendGrid',
      },
    ];
  },

  async send(
    to: string,
    subject: string,
    ejsString: string,
    data: any = {},
    options?: SendMailOptions,
  ) {
    options = options || {};

    // Get email settings
    const settings = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'mail');
    const setting = settings?.mail || {};

    const service = setting.service || 'SMTP';

    if (service === 'SMTP') {
      options.from = options.from || setting.from || undefined;
      options.replyTo = options.replyTo || setting.replyTo || undefined;

      const emailTemplate = {
        subject: subject,
        html: ejsString,
      };

      await strapi.plugins['email'].services.email.sendTemplatedEmail(
        {
          to,
          from: options.from || undefined,
          replyTo: options.replyTo || undefined,
          cc: options.cc || undefined,
          bcc: options.bcc || undefined,
        },
        emailTemplate,
        data,
      );

      return;
    }

    if (service === 'SendGrid') {
      await strapi
        .service('api::email-template.sendgrid')
        .send(to, subject, ejsString, data, options);
    }
  },

  async sendTemplate(
    to: string | { name: string; email: string },
    templateId: number,
    data: any = {},
    options?: SendMailOptions,
  ) {
    options = options || {};

    // Get email settings
    const settings = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'mail');
    const setting = settings?.mail || {};

    const template = await strapi.db
      .query('api::email-template.email-template')
      .findOne({
        where: { id: templateId },
      });

    if (!template) {
      throw new Error('Template not found');
    }

    const service = setting.service || 'SMTP';

    if (service === 'SMTP') {
      options.from = options.from || setting.from || undefined;
      options.replyTo = options.replyTo || setting.replyTo || undefined;

      const emailTemplate = {
        subject: template.title,
        html: template.content,
      };

      await strapi.plugins['email'].services.email.sendTemplatedEmail(
        {
          to,
          from: options.from || undefined,
          replyTo: options.replyTo || undefined,
          cc: options.cc || undefined,
          bcc: options.bcc || undefined,
        },
        emailTemplate,
        data,
      );

      return;
    }

    if (service === 'SendGrid') {
      await strapi
        .service('api::email-template.sendgrid')
        .sendTemplate(to, templateId, data, options);
    }
  },
});
