export default {
  routes: [
    {
      method: 'POST',
      path: '/products/create',
      handler: 'openapi.create',
    },
    {
      method: 'PUT',
      path: '/products/:id/update',
      handler: 'openapi.update',
    },
  ],
};
