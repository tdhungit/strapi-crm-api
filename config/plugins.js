module.exports = ({ env }) => ({
  tablify: {
    enabled: true,
    config: {
      // optional configs
    },
  },
  upload: {
    config: {
      sizeLimit: env.int('UPLOAD_SIZE_LIMIT', 50 * 1024 * 1024), // 50MB default
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
    },
  },

  'ui-settings': {
    enabled: true,
    resolve: './src/plugins/ui-settings',
    config: {
      // Plugin configuration
    },
  },
});
