export default {
  routes: [
    {
      method: 'GET',
      path: '/customers/leads-contacts',
      handler: 'customer.getLeadsAndContacts',
    },
    {
      method: 'POST',
      path: '/customers/contact/check-email',
      handler: 'customer.checkContactEmailExist',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/customers/contact/register',
      handler: 'customer.contactRegister',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/customers/contact/login',
      handler: 'customer.contactLogin',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/customers/contact/me',
      handler: 'customer.contactCurrent',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/customers/contact/cart',
      handler: 'customer.getCart',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/contact/cart',
      handler: 'customer.mergeCart',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/contact/orders',
      handler: 'customer.createOrderFromCart',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/customers/contact/orders',
      handler: 'customer.getOrders',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/customers/contact/orders/:id',
      handler: 'customer.getOrder',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
  ],
};
