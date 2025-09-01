const { default: uiSetting } = require('./controllers/ui-setting');

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
      {
        method: 'POST',
        path: '/upload-favicon',
        handler: 'ui-settings.uploadFavicon',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
    ],

    controllers: {
      ...uiSetting,
    },
  };
};
