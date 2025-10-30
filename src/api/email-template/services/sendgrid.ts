import sendgrid from '@sendgrid/mail';
import { SendMailMultipleDataType, SendMailOptions } from '../types';

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
    let setting: any;
    if (!options?.settings) {
      setting = await this.getSettings();
    } else {
      setting = options.settings;
    }

    if (!setting?.SendGrid?.apiKey) {
      throw new Error('SendGrid API key is not configured');
    }

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
      headers: {
        X_Mail_ID: options.mailId || '',
      },
      customArgs: {
        X_Mail_ID: options.mailId || '',
      },
    };

    await sendgrid.send(msg);
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

    if (!setting?.SendGrid?.apiKey) {
      throw new Error('SendGrid API key is not configured');
    }

    if (!setting?.SendGrid?.templateId) {
      throw new Error('SendGrid template id is not configured');
    }

    sendgrid.setApiKey(setting.SendGrid.apiKey);

    const { subject, content } = await strapi
      .service('api::email-template.email-template')
      .parseTemplateContent(templateId, data, options?.template || null);

    const personalizations = tos.map((to) => ({
      to: [{ email: to }],
      subject,
      dynamic_template_data: {
        content,
      },
      headers: {
        X_Mail_ID: options.mailId || '',
      },
      customArgs: {
        X_Mail_ID: options.mailId || '',
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
      replyToList: {
        email: setting.replyTo,
        name: setting.replyToName,
      },
    };

    await sendgrid.send(msg);
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

    if (!setting?.SendGrid?.apiKey) {
      throw new Error('SendGrid API key is not configured');
    }

    if (!setting?.SendGrid?.templateId) {
      throw new Error('SendGrid template id is not configured');
    }

    sendgrid.setApiKey(setting.SendGrid.apiKey);

    let template = options?.template || null;
    if (!template) {
      template = await strapi.db
        .query('api::email-template.email-template')
        .findOne({
          where: { id: templateId },
        });
    }

    const personalizations = [];
    for await (const item of data) {
      const subject = await strapi
        .service('api::email-template.email-template')
        .parseContent(template.title, item.data);

      const content = await strapi
        .service('api::email-template.email-template')
        .parseContent(template.content, item.data);

      let mailId = options.mailId || '';
      if (item.data?.id) {
        mailId = `${mailId}:${item.data.id}`;
      }

      personalizations.push({
        to: [{ email: item.to }],
        subject,
        dynamic_template_data: {
          content,
        },
        headers: {
          X_Mail_ID: mailId,
        },
        customArgs: {
          X_Mail_ID: mailId,
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
      replyToList: {
        email: setting.replyTo,
        name: setting.replyToName,
      },
    };

    await sendgrid.send(msg);
  },
});
