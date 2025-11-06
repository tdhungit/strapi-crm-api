module.exports = {
  webhooks: {
    create: async (ctx) => {
      const { name, uid, trigger, webhook } = ctx.request.body;
      if (!name || !uid || !trigger || !webhook) {
        return ctx.badRequest('Missing required fields');
      }
      const webhookObj = await strapi.db
        .query('api::crm-webhook.crm-webhook')
        .create({
          data: { name, uid, trigger, webhook },
        });
      return webhookObj;
    },
    update: async (ctx) => {
      const { id } = ctx.params;
      const { name, uid, trigger, webhook } = ctx.request.body;
      const webhookObj = await strapi.db
        .query('api::crm-webhook.crm-webhook')
        .update({
          where: { id },
          data: { name, uid, trigger, webhook },
        });
      return webhookObj;
    },
    delete: async (ctx) => {
      const { id } = ctx.params;
      await strapi.db
        .query('api::crm-webhook.crm-webhook')
        .delete({ where: { id } });
      return { message: 'Webhook deleted successfully' };
    },
    list: async (ctx) => {
      const { name } = ctx.query;
      const where = {};
      if (name) {
        where.name = { $contains: name };
      }
      const webhooks = await strapi.db
        .query('api::crm-webhook.crm-webhook')
        .findMany({
          where,
        });
      return webhooks;
    },
  },
};
