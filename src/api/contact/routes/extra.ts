export default {
  routes: [
    {
      method: 'GET',
      path: '/customers/leads-contacts',
      handler: 'internal.getLeadsAndContacts',
    },
  ],
};
