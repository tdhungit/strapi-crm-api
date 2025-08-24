module.exports = {
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
      method: 'PUT',
      path: '/settings/menus',
      handler: 'setting.updateMenus',
    },
  ],
};
