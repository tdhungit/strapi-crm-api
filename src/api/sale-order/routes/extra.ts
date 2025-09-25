export default {
  routes: [
    {
      method: 'PUT',
      path: '/sale-orders/:id/complete',
      handler: 'sale-order.completeOrder',
    },
    {
      method: 'PUT',
      path: '/sale-orders/:id/status',
      handler: 'sale-order.changeStatus',
    },
  ],
};
