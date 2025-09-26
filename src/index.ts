import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Global lifecycle
    strapi.db.lifecycles.subscribe((event) => {
      // check and auto install app
      strapi.service('api::setting.install').autoInstall(event);

      // Call the audit log service to log the action
      strapi.service('api::audit-log.audit-log').logAction(event);

      // Call the inventory service to trigger timeline entries
      strapi.service('api::inventory.inventory').triggerTimeline(event);
    });
  },

  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
