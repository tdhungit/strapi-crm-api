import { SendMailOptions } from '../types';

export default () => ({
  async sendMail(
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
  },
});
