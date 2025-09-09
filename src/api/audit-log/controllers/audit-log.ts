import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::audit-log.audit-log',
  ({ strapi }) => ({
    async getAuditLogs(ctx) {
      const user = ctx.state.user;
      const { model, id } = ctx.params;

      const auditLogs = await strapi.service('api::audit-log.audit-log').find({
        filters: {
          model,
          recordId: id,
          assigned_user: user.id,
        },
        sort: { timestamp: 'desc' },
        populate: ['assigned_user'],
      });

      return auditLogs;
    },
  })
);
