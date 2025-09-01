export default {
  routes: [
    {
      method: 'GET',
      path: '/settings/app',
      handler: 'setting.getAppSettings',
    },
    {
      method: 'GET',
      path: '/settings/available-menus',
      handler: 'setting.getAvailableMenus',
    },
    {
      method: 'GET',
      path: '/settings/hidden-menus',
      handler: 'setting.getHiddenMenus',
    },
    {
      method: 'GET',
      path: '/settings/logo',
      handler: 'setting.getLogo',
    },
    {
      method: 'PUT',
      path: '/settings/menus',
      handler: 'setting.updateMenus',
    },
    {
      method: 'GET',
      path: '/settings/:category',
      handler: 'setting.getSettings',
    },
    {
      method: 'PUT',
      path: '/settings/:category',
      handler: 'setting.updateSettings',
    },
  ],
};
