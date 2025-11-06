const uiSetting = require('./controllers/ui-settings');
const auditLogs = require('./controllers/audit-logs');
const addresses = require('./controllers/addresses');
const settings = require('./controllers/settings');
const webhooks = require('./controllers/webhooks');

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
      {
        method: 'GET',
        path: '/mail-services',
        handler: 'ui-settings.getMailServices',
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
      // Addresses
      {
        method: 'GET',
        path: '/addresses/statistics',
        handler: 'addresses.getAddressStatistics',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
      {
        method: 'POST',
        path: '/addresses/import-address-data',
        handler: 'addresses.importAddressData',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
      // Settings
      {
        method: 'GET',
        path: '/settings/:category',
        handler: 'settings.getCategorySettings',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
      {
        method: 'GET',
        path: '/settings/:category/:key',
        handler: 'settings.getSetting',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
      {
        method: 'POST',
        path: '/settings/:category/:key',
        handler: 'settings.updateSetting',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
      {
        method: 'POST',
        path: '/settings/upload',
        handler: 'settings.uploadFile',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
      // Webhooks
      {
        method: 'POST',
        path: '/webhooks',
        handler: 'webhooks.create',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
      {
        method: 'GET',
        path: '/webhooks',
        handler: 'webhooks.list',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
      {
        method: 'PUT',
        path: '/webhooks/:id',
        handler: 'webhooks.update',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
      {
        method: 'DELETE',
        path: '/webhooks/:id',
        handler: 'webhooks.delete',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
    ],

    controllers: {
      ...uiSetting,
      ...auditLogs,
      ...addresses,
      ...settings,
      ...webhooks,
    },
  };
};
