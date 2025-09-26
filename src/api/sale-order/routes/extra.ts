export default {
  routes: [
    {
      method: 'PUT',
      path: '/sale-orders/:id/status',
      handler: 'sale-order.changeStatus',
    },
  ],
};
