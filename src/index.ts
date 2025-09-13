import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Global lifecycle
    strapi.db.lifecycles.subscribe((event) => {
      // check and auto install app
      strapi.service('api::setting.install').autoInstall(event);
      // Call the audit log service to log the action
      strapi.service('api::audit-log.audit-log').logAction(event);
    });
  },

  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
