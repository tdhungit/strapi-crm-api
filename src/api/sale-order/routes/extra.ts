export default {
  routes: [
    {
      method: 'PUT',
      path: '/sale-orders/:id/complete',
      handler: 'sale-order.completeOrder',
    },
  ],
};
