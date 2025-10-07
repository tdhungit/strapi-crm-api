import { Files } from '@strapi/icons';
import pluginId from './pluginId';

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: () => <Files />,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Payment Methods',
      },
      Component: async () => {
        const component = await import('./pages');
        return component.default;
      },
      permissions: [],
    });

    app.registerPlugin({
      id: pluginId,
      name: 'Payment Methods',
    });
  },
};
