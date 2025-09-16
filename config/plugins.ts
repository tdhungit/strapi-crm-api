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

  'crm-fields': {
    enabled: true,
    resolve: './src/plugins/crm-fields',
    config: {
      // Plugin configuration
    },
  },

  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        secure: env['SMTP_SECURE'] === 'true' ? true : false,
      },
      settings: {
        defaultFrom: 'noreply@strapicrm.com',
        defaultReplyTo: 'noreply@strapicrm.com',
      },
    },
  },
});
