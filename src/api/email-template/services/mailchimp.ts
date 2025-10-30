import MailchimpTransactional from '@mailchimp/mailchimp_transactional';
import { SendMailMultipleDataType, SendMailOptions } from '../types';

export default {
  async getSettings() {
    const settings = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'mail');

    const setting = settings.mail || {};

    if (!setting?.service || setting?.service !== 'Mailchimp') {
      throw new Error('Mailchimp is not enabled');
    }

    if (!setting?.Mailchimp?.apiKey) {
      throw new Error('Mailchimp API key is not configured');
    }

    return setting;
  },

  async send(
    to: string,
    subject: string,
    text: string,
    options?: SendMailOptions,
  ) {
    let setting: any;
    if (!options?.settings) {
      setting = await this.getSettings();
    } else {
      setting = options.settings;
    }

    if (!setting?.Mailchimp?.apiKey) {
      throw new Error('Mailchimp API key is not configured');
    }

    if (options?.contentType === 'template') {
      text = await strapi
        .service('api::email-template.email-template')
        .parseContent(text, options?.data || {});
    }

    const mailchimp = new MailchimpTransactional(setting.Mailchimp.apiKey);

    await mailchimp.messages.send({
      from_email: setting.from,
      from_name: setting.fromName,
      to: [{ email: to, type: 'to' }],
      subject,
      html: text,
      headers: {
        X_Mail_ID: options.mailId || '',
      },
      custom_args: {
        X_Mail_ID: options.mailId || '',
      },
    });
  },

  async sendTemplate(
    tos: string[],
    templateId: string,
    data: any = {},
    options?: SendMailOptions,
  ) {
    let setting: any;
    if (!options?.settings) {
      setting = await this.getSettings();
    } else {
      setting = options.settings;
    }

    if (!setting?.Mailchimp?.apiKey) {
      throw new Error('Mailchimp API key is not configured');
    }

    const mailchimp = new MailchimpTransactional(setting.Mailchimp.apiKey);

    const to: any[] = [];
    tos.forEach((toEmail) => {
      to.push({ email: toEmail, type: 'to' });
    });

    const { subject, content } = await strapi
      .service('api::email-template.email-template')
      .parseTemplateContent(templateId, data, options?.template || null);

    await mailchimp.messages.send({
      from_email: setting.from,
      from_name: setting.fromName,
      to,
      subject,
      html: content,
      headers: {
        X_Mail_ID: options.mailId || '',
      },
      custom_args: {
        X_Mail_ID: options.mailId || '',
      },
    });
  },

  async sendMultiple(
    templateId: number,
    data: SendMailMultipleDataType[],
    options?: SendMailOptions,
  ) {
    let setting: any;
    if (!options?.settings) {
      setting = await this.getSettings();
    } else {
      setting = options.settings;
    }

    if (!setting?.Mailchimp?.apiKey) {
      throw new Error('Mailchimp API key is not configured');
    }

    let template = options?.template || null;
    if (!template) {
      template = await strapi.db
        .query('api::email-template.email-template')
        .findOne({
          where: { id: templateId },
        });
      options.template = template;
    }

    const mailchimp = new MailchimpTransactional(setting.Mailchimp.apiKey);

    for await (const item of data) {
      const { subject, content } = await strapi
        .service('api::email-template.email-template')
        .parseTemplateContent(templateId, item.data, options?.template || null);

      await mailchimp.messages.send({
        from_email: setting.from,
        from_name: setting.fromName,
        to: [{ email: item.to, type: 'to' }],
        subject,
        html: content,
        headers: {
          X_Mail_ID: options.mailId || '',
        },
        custom_args: {
          X_Mail_ID: options.mailId || '',
        },
      });
    }
  },
};
