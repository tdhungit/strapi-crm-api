export default {
  routes: [
    {
      method: 'PUT',
      path: '/purchase-orders/:id/complete',
      handler: 'purchase-order.completeOrder',
    },
    {
      method: 'PUT',
      path: '/purchase-orders/:id/status',
      handler: 'purchase-order.changeStatus',
    },
  ],
};
