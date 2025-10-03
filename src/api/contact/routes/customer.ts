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
    },
    {
      method: 'POST',
      path: '/customers/contact/register',
      handler: 'customer.contactRegister',
    },
  ],
};
