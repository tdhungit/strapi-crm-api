export default {
  routes: [
    {
      method: 'GET',
      path: '/customers/leads-contacts',
      handler: 'customer.getLeadsAndContacts',
    },
  ],
};
