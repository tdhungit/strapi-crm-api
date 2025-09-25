export default {
  routes: [
    {
      method: 'GET',
      path: '/inventories/warehouse/:warehouseId/available-products',
      handler: 'inventory.getAvailableProducts',
    },
  ],
};
