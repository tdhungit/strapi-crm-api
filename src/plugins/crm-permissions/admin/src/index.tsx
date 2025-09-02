import { Key } from '@strapi/icons';
import pluginId from './pluginId';

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: () => <Key />,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Permissions',
      },
      Component: async () => {
        const component = await import('./pages');
        return component.default;
      },
      permissions: [],
    });

    app.registerPlugin({
      id: pluginId,
      name: 'Permissions',
    });
  },

  async bootstrap(app) {},
};
