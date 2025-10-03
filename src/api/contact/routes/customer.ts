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
  ],
};
