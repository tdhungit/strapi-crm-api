module.exports = ({ strapi }) => {
  return {
    register() {},

    bootstrap() {},

    // Register routes
    routes: [
      {
        method: 'GET',
        path: '/ui-settings/config',
        handler: 'ui-settings.getConfig',
        config: { auth: false }, // public
      },
      {
        method: 'POST',
        path: '/ui-settings/config',
        handler: 'ui-settings.setConfig',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
    ],

    controllers: {
      'ui-settings': {
        async getConfig(ctx) {
          try {
            const store = strapi.store({ type: 'plugin', name: 'ui-settings' });
            const settings = (await store.get({ key: 'config' })) || {};
            ctx.body = settings;
          } catch (error) {
            console.error('Error getting UI settings config:', error);
            ctx.body = {};
          }
        },

        async setConfig(ctx) {
          try {
            const { pageTitle, pageSubtitle, favicon } = ctx.request.body;
            const store = strapi.store({ type: 'plugin', name: 'ui-settings' });
            await store.set({
              key: 'config',
              value: { pageTitle, pageSubtitle, favicon },
            });
            ctx.body = { ok: true };
          } catch (error) {
            console.error('Error setting UI settings config:', error);
            ctx.badRequest('Failed to save settings');
          }
        },
      },
    },
  };
};
