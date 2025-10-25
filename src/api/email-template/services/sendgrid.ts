import sendgrid from '@sendgrid/mail';
import { SendMailOptions } from '../types';

export default () => ({
  async getSettings() {
    const settings = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'mail');

    const setting = settings.mail || {};

    if (!setting?.service || setting?.service !== 'SendGrid') {
      throw new Error('SendGrid is not enabled');
    }

    if (!setting?.SendGrid?.apiKey) {
      throw new Error('SendGrid API key is not configured');
    }

    return setting;
  },

  async send(
    to: string,
    subject: string,
    text: string,
    options?: SendMailOptions,
  ) {
    const setting = await this.getSettings();

    if (options?.contentType === 'template') {
      text = await strapi
        .service('api::email-template.email-template')
        .parseContent(text, options?.data || {});
    }

    sendgrid.setApiKey(setting.SendGrid.apiKey);

    const msg: sendgrid.MailDataRequired = {
      to,
      from: {
        email: setting.from,
        name: setting.fromName,
      },
      replyTo: {
        email: setting.replyTo,
        name: setting.replyToName,
      },
      subject,
      text,
    };

    await sendgrid.send(msg);
  },

  async sendTemplate(tos: string[], templateId: string, data: any = {}) {
    const setting = await this.getSettings();
    if (!setting?.SendGrid?.templateId) {
      throw new Error('SendGrid template id is not configured');
    }

    sendgrid.setApiKey(setting.SendGrid.apiKey);

    const { subject, content } = await strapi
      .service('api::email-template.email-template')
      .parseTemplateContent(templateId, data);

    const personalizations = tos.map((to) => ({
      to: [{ email: to }],
      subject,
      dynamic_template_data: {
        content,
      },
    }));

    const msg: sendgrid.MailDataRequired = {
      from: {
        email: setting.from,
        name: setting.fromName,
      },
      replyTo: {
        email: setting.replyTo,
        name: setting.replyToName,
      },
      personalizations,
      templateId: setting.SendGrid.templateId,
    };

    await sendgrid.send(msg);
  },

  async sendMultiple(templateId: number, data: { to: string; data: any }[]) {
    const setting = await this.getSettings();
    if (!setting?.SendGrid?.templateId) {
      throw new Error('SendGrid template id is not configured');
    }

    sendgrid.setApiKey(setting.SendGrid.apiKey);

    const template = await strapi.db
      .query('api::email-template.email-template')
      .findOne({
        where: { id: templateId },
      });

    const personalizations = [];
    for await (const item of data) {
      const subject = await strapi
        .service('api::email-template.email-template')
        .parseContent(template.title, item.data);
      const content = await strapi
        .service('api::email-template.email-template')
        .parseContent(template.content, item.data);

      personalizations.push({
        to: [{ email: item.to }],
        subject,
        dynamic_template_data: {
          content,
        },
      });
    }

    const msg: sendgrid.MailDataRequired = {
      from: {
        email: setting.from,
        name: setting.fromName,
      },
      replyTo: {
        email: setting.replyTo,
        name: setting.replyToName,
      },
      personalizations,
      templateId: setting.SendGrid.templateId,
    };

    await sendgrid.send(msg);
  },
});
