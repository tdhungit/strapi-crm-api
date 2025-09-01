module.exports = () => {
  return {
    register() {},

    bootstrap() {},

    // Register routes
    routes: [
      {
        method: 'GET',
        path: '/config',
        handler: 'ui-settings.getConfig',
        config: { auth: false },
      },
      {
        method: 'POST',
        path: '/config',
        handler: 'ui-settings.setConfig',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
    ],

    controllers: {
      'ui-settings': {
        async getConfig(ctx) {
          try {
            const store = strapi.db.query('strapi::core-store');
            const settings = await store.findOne({
              where: {
                key: `plugin_ui-settings_config`,
              },
            });
            if (settings?.value) {
              return settings.value;
            }
            return {};
          } catch (error) {
            console.error('Error getting UI settings config:', error);
            return {};
          }
        },

        async setConfig(ctx) {
          try {
            const store = strapi.db.query('strapi::core-store');
            const settings = await store.findOne({
              where: {
                key: `plugin_ui-settings_config`,
              },
            });
            if (settings) {
              await store.update({
                where: {
                  key: `plugin_ui-settings_config`,
                },
                data: {
                  value: JSON.stringify(ctx.request.body),
                },
              });
            } else {
              await store.create({
                data: {
                  key: `plugin_ui-settings_config`,
                  value: JSON.stringify(ctx.request.body),
                },
              });
            }
            return { status: 'ok' };
          } catch (error) {
            console.error('Error setting UI settings config:', error);
            return { status: 'error' };
          }
        },
      },
    },
  };
};
