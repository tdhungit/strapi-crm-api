export default {
  routes: [
    {
      method: 'PUT',
      path: '/sale-orders/:id/status',
      handler: 'sale-order.changeStatus',
    },
    {
      method: 'POST',
      path: '/sale-orders/completed',
      handler: 'sale-order.createCompletedOrder',
    },
  ],
};
