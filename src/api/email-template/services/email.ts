import { wait } from '../../../helpers/utils';
import { SendMailMultipleDataType, SendMailOptions } from '../types';

export default () => ({
  async getMailServices() {
    return [
      {
        name: 'SendGrid',
        value: 'SendGrid',
      },
      {
        name: 'Mailchimp',
        value: 'Mailchimp',
      },
      {
        name: 'Mailgun',
        value: 'Mailgun',
      },
    ];
  },

  getMailID() {
    return Date.now() + Math.random().toString(36).substring(2, 15);
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

    const service = setting.service || 'default';

    if (service === 'SendGrid') {
      await strapi
        .service('api::email-template.sendgrid')
        .send(to, subject, ejsString, data, options);
      return;
    }

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
        headers: {
          X_Mail_ID: options.mailId || this.getMailID(),
        },
      },
      emailTemplate,
      data,
    );
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

    const service = setting.service || 'default';

    if (service === 'SendGrid') {
      await strapi
        .service('api::email-template.sendgrid')
        .sendTemplate(to, templateId, data, options);
      return;
    }

    const template = await strapi.db
      .query('api::email-template.email-template')
      .findOne({
        where: { id: templateId },
      });

    if (!template) {
      throw new Error('Template not found');
    }

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
        headers: {
          X_Mail_ID: options.mailId || this.getMailID(),
        },
      },
      emailTemplate,
      data,
    );
  },

  async sendMultiple(
    templateId: number,
    data: SendMailMultipleDataType[],
    options?: SendMailOptions,
  ) {
    options = options || {};

    // Get email settings
    const settings = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'mail');
    const setting = settings?.mail || {};

    const service = setting.service || 'default';

    if (service === 'SendGrid') {
      await strapi
        .service('api::email-template.sendgrid')
        .sendMultiple(templateId, data, options);
      return;
    }

    let template = options?.template || null;
    if (!template) {
      template = await strapi.db
        .query('api::email-template.email-template')
        .findOne({
          where: { id: templateId },
        });
    }

    if (!template) {
      throw new Error('Template not found');
    }

    options.from = options.from || setting.from || undefined;
    options.replyTo = options.replyTo || setting.replyTo || undefined;
    const emailTemplate = {
      subject: template.title,
      html: template.content,
    };

    for await (const item of data) {
      let mailId = options.mailId || this.getMailID();
      if (item.data?.id) {
        mailId = `${mailId}:${item.data.id}`;
      }

      await strapi.plugins['email'].services.email.sendTemplatedEmail(
        {
          to: item.to,
          from: options.from || undefined,
          replyTo: options.replyTo || undefined,
          cc: options.cc || undefined,
          bcc: options.bcc || undefined,
          headers: {
            X_Mail_ID: mailId,
          },
        },
        emailTemplate,
        item.data,
      );
    }
  },

  async sendBatches(
    templateId: number,
    data: SendMailMultipleDataType[],
    options?: SendMailOptions,
  ) {
    options = options || {};
    let template = options?.template || null;
    if (!template) {
      template = await strapi.db
        .query('api::email-template.email-template')
        .findOne({
          where: { id: templateId },
        });
    }

    if (!template) {
      throw new Error('Template not found');
    }

    options.template = template;

    const batchSize = 100;
    const totalBatches = Math.ceil(data.length / batchSize);
    for (let i = 0; i < totalBatches; i++) {
      const batch = data.slice(i * batchSize, (i + 1) * batchSize);

      try {
        await this.sendMultiple(templateId, batch, options);
        console.log(`Batch ${i + 1} sent successfully`);
      } catch (error) {
        console.log(`Batch ${i + 1} sent failed`, error);
      }

      await wait(1000);
    }
  },
});
