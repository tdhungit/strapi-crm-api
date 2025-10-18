export default () => ({
  async sendMail(
    to: string,
    subject: string,
    ejsString: string,
    data: any = {},
    options?: any,
  ) {
    options = options || {};

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
