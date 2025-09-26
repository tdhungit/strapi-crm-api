export default {
  routes: [
    {
      method: 'PUT',
      path: '/purchase-orders/:id/status',
      handler: 'purchase-order.changeStatus',
    },
  ],
};
