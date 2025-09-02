import type { Event } from '@strapi/database/dist/lifecycles';
import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::audit-log.audit-log',
  ({ strapi }) => ({
    async logAction(event: Event) {
      const { action, model, params, result } = event;

      if (!['beforeCreate', 'beforeUpdate', 'beforeDelete'].includes(action)) {
        return;
      }

      if (model.uid === 'api::audit-log.audit-log') {
        return;
      }

      const user = strapi.requestContext.get()?.state?.user;
      if (!user) {
        return;
      }

      const config = await this.getConfig();
      if (!config.includes(model.uid)) {
        return;
      }

      await strapi.db.query('api::audit-log.audit-log').create({
        data: {
          action,
          model: model.uid,
          recordId: params?.where?.id || result?.id,
          assigned_user: user.id,
          data: params.data || result,
          timestamp: new Date(),
        },
      });
    },

    async getConfig() {
      const store = strapi.db.query('strapi::core-store');
      const setting = await store.findOne({
        where: {
          key: `plugin_ui-settings_audit-logs_config`,
        },
      });

      if (!setting) {
        return [];
      }

      const config = JSON.parse(setting.value);
      return config?.auditContentTypes?.map((item: any) => item.uid) || [];
    },
  })
);
