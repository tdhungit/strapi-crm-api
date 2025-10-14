export default {
  routes: [
    {
      method: 'GET',
      path: '/customers/contact/cart',
      handler: 'order.getCart',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/contact/cart',
      handler: 'order.mergeCart',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/contact/orders',
      handler: 'order.createOrderFromCart',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/customers/contact/orders',
      handler: 'order.getOrders',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/customers/contact/orders/:id',
      handler: 'order.getOrder',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'PUT',
      path: '/customers/contact/orders/:id',
      handler: 'order.updateOrder',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
  ],
};
