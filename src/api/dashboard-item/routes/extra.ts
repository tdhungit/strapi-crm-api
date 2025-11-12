export default {
  routes: [
    {
      method: 'GET',
      path: '/dashboard-item/:id/query-data',
      handler: 'dashboard-item.getItemData',
    },
  ],
};
