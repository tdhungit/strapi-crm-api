export default {
  async sendSMS(params: any) {
    const settings = await strapi
      .service('api::setting.setting')
      .getCRMSettings();

    const { telecomProvider } = settings;
    if (!telecomProvider) {
      return { error: 'Missing required parameters' };
    }

    const { to, body, module, recordId, userId } = params;
    if (!to || !body || !module || !recordId || !userId) {
      return { error: 'Missing required parameters' };
    }

    if (telecomProvider === 'twilio') {
      return await strapi
        .service('api::telecom.twilio')
        .sendSMS({ to, body }, userId, module, recordId);
    }

    return { error: 'Unsupported telecom provider' };
  },
};
