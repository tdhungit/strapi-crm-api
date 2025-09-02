import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::audit-log.audit-log',
  ({ strapi }) => ({
    async getAuditLogs(ctx) {
      const user = ctx.state.user;
      const { model, id } = ctx.params;

      const config = await strapi
        .service('api::metadata.metadata')
        .getContentTypeConfiguration('plugin::users-permissions.user');
      const page: number = parseInt(ctx.query.page as string, 10) || 1;
      const pageSize: number =
        parseInt(ctx.query.pageSize as string, 10) || config.settings.pageSize;

      const auditLogs = await strapi.entityService.findMany(
        'api::audit-log.audit-log',
        {
          filters: {
            model,
            recordId: id,
            assigned_user: user.id,
          },
          sort: { timestamp: 'desc' },
          populate: ['assigned_user'],
          limit: pageSize,
          start: (page - 1) * pageSize,
        }
      );
      return auditLogs;
    },
  })
);
