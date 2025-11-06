export default {
  routes: [
    {
      method: 'POST',
      path: '/contacts/create-or-update',
      handler: 'openapi.createOrUpdate',
    },
  ],
};
