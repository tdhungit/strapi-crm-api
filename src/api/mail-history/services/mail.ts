import { MailSendOptions, MailSendType } from '../types';

export default () => ({
  async send({
    to,
    from,
    subject,
    text,
    html,
    replyTo,
    cc,
    bcc,
    attachments,
  }: MailSendType) {
    return await strapi.plugin('email').service('email').send({
      to,
      from,
      subject,
      text,
      html,
      replyTo,
      cc,
      bcc,
      attachments,
    });
  },

  async sendTemplate(templateId: number, data: MailSendType) {
    const template = await strapi.db
      .query('api::email-template.email-template')
      .findOne({
        where: { id: templateId },
      });

    if (!template) {
      throw new Error('Template not found');
    }

    data.html = template.content;

    return await this.send(data);
  },

  async addToHistory(
    mail: any,
    collectionName: string,
    record: any,
    data: MailSendType,
    options?: MailSendOptions
  ) {
    const emailConfig: any = strapi.config.get('plugin.email');
    const from_email = emailConfig.settings.defaultFrom;

    return await strapi.db.query('api::mail-history.mail-history').create({
      data: {
        title: data.subject,
        body: data.html || data.text || '',
        from_email: data.from || from_email,
        to_email: data.to,
        mail_status: 'sent',
        metadata: mail || {},
        assigned_user: options?.userId || null,
        source: options?.source || null,
        source_id: options?.sourceId || null,
        model: collectionName,
        record_id: record.id,
        service_sid: mail?.messageId || mail?.message_id || null,
      },
    });
  },

  async sendTo(
    collectionName: string,
    record: any,
    data: MailSendType,
    options?: MailSendOptions
  ) {
    let mail: any;
    if (options?.templateId) {
      mail = await this.sendTemplate(options.templateId, data);
    } else {
      mail = await this.send(data);
    }

    return await this.addToHistory(mail, collectionName, record, data, options);
  },
});
