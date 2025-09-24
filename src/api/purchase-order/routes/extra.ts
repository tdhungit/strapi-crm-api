export default {
  routes: [
    {
      method: 'PUT',
      path: '/purchase-orders/:id/complete',
      handler: 'purchase-order.completeOrder',
    },
  ],
};
