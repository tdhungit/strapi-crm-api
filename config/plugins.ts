export default ({ env }) => ({
  'ui-settings': {
    enabled: true,
    resolve: './src/plugins/ui-settings',
    config: {
      // Plugin configuration
    },
  },
  'crm-permissions': {
    enabled: true,
    resolve: './src/plugins/crm-permissions',
    config: {
      // Plugin configuration
    },
  },
});
