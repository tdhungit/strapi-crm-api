export default {
  routes: [
    {
      method: 'GET',
      path: '/customers/contact-addresses',
      handler: 'customer.getAddresses',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/customers/contact-addresses/default',
      handler: 'customer.getDefaultAddress',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/contact-addresses',
      handler: 'customer.createAddress',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'PUT',
      path: '/customers/contact-addresses/update/:id',
      handler: 'customer.updateAddress',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'DELETE',
      path: '/customers/contact-addresses/delete/:id',
      handler: 'customer.deleteAddress',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'PUT',
      path: '/customers/contact-addresses/set-default/:id',
      handler: 'customer.setDefault',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
  ],
};
