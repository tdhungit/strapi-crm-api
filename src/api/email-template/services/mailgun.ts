import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { SendMailMultipleDataType, SendMailOptions } from '../types';

export default {
  async getSettings() {
    const settings = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'mail');

    const setting = settings.mail || {};

    if (!setting?.service || setting?.service !== 'Mailgun') {
      throw new Error('Mailgun is not enabled');
    }

    if (
      !setting?.Mailgun?.apiKey ||
      !setting?.Mailgun?.domain ||
      !setting?.Mailgun?.username
    ) {
      throw new Error('Mailgun API key, domain, or username is not configured');
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

    if (
      !setting?.Mailgun?.apiKey ||
      !setting?.Mailgun?.domain ||
      !setting?.Mailgun?.username
    ) {
      throw new Error('Mailgun API key, domain, or username is not configured');
    }

    if (options?.contentType === 'template') {
      text = await strapi
        .service('api::email-template.email-template')
        .parseContent(text, options?.data || {});
    }

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: setting.Mailgun.username,
      key: setting.Mailgun.apiKey,
    });

    return await mg.messages.create(setting.Mailgun.domain, {
      from: `${setting.fromName} <${setting.from}>`,
      to,
      subject,
      html: text,
      'h:Reply-To': `${setting.replyToName} <${setting.replyTo}>`,
      'h:X_Mail_ID': options.mailId || '',
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

    if (
      !setting?.Mailgun?.apiKey ||
      !setting?.Mailgun?.domain ||
      !setting?.Mailgun?.username
    ) {
      throw new Error('Mailgun API key, domain, or username is not configured');
    }

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: setting.Mailgun.username,
      key: setting.Mailgun.apiKey,
    });

    const { subject, content } = await strapi
      .service('api::email-template.email-template')
      .parseTemplateContent(templateId, data, options?.template || null);

    return await mg.messages.create(setting.Mailgun.domain, {
      from: `${setting.fromName} <${setting.from}>`,
      tos,
      subject,
      html: content,
      'h:Reply-To': `${setting.replyToName} <${setting.replyTo}>`,
      'h:X_Mail_ID': options.mailId || '',
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

    if (
      !setting?.Mailgun?.apiKey ||
      !setting?.Mailgun?.domain ||
      !setting?.Mailgun?.username
    ) {
      throw new Error('Mailgun API key, domain, or username is not configured');
    }

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: setting.Mailgun.username,
      key: setting.Mailgun.apiKey,
    });

    let template = options?.template || null;
    if (!template) {
      template = await strapi.db
        .query('api::email-template.email-template')
        .findOne({
          where: { id: templateId },
        });
      options.template = template;
    }

    for await (const item of data) {
      const { subject, content } = await strapi
        .service('api::email-template.email-template')
        .parseTemplateContent(templateId, item.data, options?.template || null);

      await mg.messages.create(setting.Mailgun.domain, {
        from: `${setting.fromName} <${setting.from}>`,
        to:
          typeof item.to === 'string'
            ? item.to
            : `${item.to.name} <${item.to.email}>`,
        subject,
        html: content,
        'h:Reply-To': `${setting.replyToName} <${setting.replyTo}>`,
        'h:X_Mail_ID': options.mailId || '',
      });
    }
  },
};
