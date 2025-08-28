// @ts-nocheck
import { StrikeThrough } from '@strapi/icons';
import React from 'react';
import pluginId from './pluginId';

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: () => <StrikeThrough />,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'UI Settings',
      },
      Component: async () => {
        // @ts-ignore
        const component = await import('./pages/index.jsx');
        return component.default;
      },
      permissions: [],
    });

    app.registerPlugin({
      id: pluginId,
      name: 'UI Settings',
    });
  },

  bootstrap() {},
};
