import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Global lifecycle
    strapi.db.lifecycles.subscribe((event) => {
      // Check and auto install app
      strapi.service('api::setting.install').autoInstall(event);

      // Audit log
      strapi.service('api::audit-log.audit-log').logAction(event);

      // Inventory change
      strapi.service('api::inventory.inventory').triggerChange(event);

      // Payment change
      strapi.service('api::payment.payment').triggerChange(event);
    });
  },

  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
