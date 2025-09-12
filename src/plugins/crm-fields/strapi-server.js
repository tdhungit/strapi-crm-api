module.exports = () => {
  return {
    register({ strapi }) {
      strapi.customFields.register({
        name: 'ranking',
        plugin: 'crm-fields',
        type: 'integer',
      });
    },

    bootstrap() {},

    routes: [],

    controllers: {},
  };
};
