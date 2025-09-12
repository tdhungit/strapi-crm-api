import { Heart } from '@strapi/icons';
import pluginId from './pluginId';

export default {
  register(app) {
    app.registerPlugin({
      id: pluginId,
      name: 'CRM Fields',
    });

    this.addRankingField(app);
  },

  async bootstrap(app) {},

  addRankingField(app) {
    app.customFields.register({
      name: 'ranking',
      pluginId: 'crm-fields',
      type: 'integer',
      intlLabel: {
        id: 'crm-fields.ranking.label',
        defaultMessage: 'Ranking',
      },
      intlDescription: {
        id: 'crm-fields.ranking.description',
        defaultMessage: 'Ranking',
      },
      icon: Heart,
      components: {
        Input: async () =>
          import('./components/RankingField').then((module) => ({
            default: module.default,
          })),
      },
      options: {
        // declare options here
      },
    });
  },
};
