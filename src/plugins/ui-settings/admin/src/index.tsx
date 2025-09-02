import { Eye } from '@strapi/icons';
import pluginId from './pluginId';

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: () => <Eye />,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'UI Settings',
      },
      Component: async () => {
        const component = await import('./pages');
        return component.default;
      },
      permissions: [],
    });

    app.registerPlugin({
      id: pluginId,
      name: 'UI Settings',
    });
  },

  async bootstrap(app) {
    let config: any = {};
    try {
      const res = await fetch('/ui-settings/config', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      config = await res.json();
    } catch (error) {
      console.error('Error fetching UI settings config:', error);
    }

    const applyConfig = () => {
      // update page title
      const baseTitle = document.title.replace(/\s*\|.*$/, '');
      const pageTitle = config?.pageTitle || 'Strapi CRM';
      if (pageTitle) {
        document.title = `${baseTitle} | ${pageTitle}`;
      }
      // update favicon
      if (config?.favicon) {
        let link: any = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = config.favicon;
      }
    };

    applyConfig();

    const observer = new MutationObserver(applyConfig);
    observer.observe(document.querySelector('#strapi') as Node, {
      childList: true,
      subtree: true,
    });
  },
};
