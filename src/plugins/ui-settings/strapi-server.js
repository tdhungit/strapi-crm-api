const { default: uiSetting } = require('./controllers/ui-settings');
const { default: auditLogs } = require('./controllers/audit-logs');

module.exports = () => {
  return {
    register() {},

    bootstrap() {},

    // Register routes
    routes: [
      // UI Settings
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
      // Audit Logs
      {
        method: 'POST',
        path: '/audit-logs/settings',
        handler: 'audit-logs.saveSettings',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
      {
        method: 'GET',
        path: '/audit-logs/settings',
        handler: 'audit-logs.getSettings',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
    ],

    controllers: {
      ...uiSetting,
      ...auditLogs,
    },
  };
};
