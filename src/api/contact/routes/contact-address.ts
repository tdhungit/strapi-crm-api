export default {
  routes: [
    {
      method: 'GET',
      path: '/customers/contact-addresses',
      handler: 'contact-address.getAddresses',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/customers/contact-addresses/default',
      handler: 'contact-address.getDefaultAddress',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/contact-addresses',
      handler: 'contact-address.createAddress',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'PUT',
      path: '/customers/contact-addresses/update/:id',
      handler: 'contact-address.updateAddress',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'DELETE',
      path: '/customers/contact-addresses/delete/:id',
      handler: 'contact-address.deleteAddress',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'PUT',
      path: '/customers/contact-addresses/set-default/:id',
      handler: 'contact-address.setDefault',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
  ],
};
