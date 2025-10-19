export default {
  routes: [
    {
      method: 'PUT',
      path: '/inventory-manuals/:id/change-status',
      handler: 'inventory-manual.changeStatus',
    },
  ],
};
