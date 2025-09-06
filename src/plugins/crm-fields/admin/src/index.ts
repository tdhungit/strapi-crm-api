import pluginId from './pluginId';

export default {
  register(app) {
    app.registerPlugin({
      id: pluginId,
      name: 'CRM Fields',
    });
  },

  async bootstrap(app) {},
};
