export default {
  routes: [
    {
      method: 'POST',
      path: '/leads/create-or-update',
      handler: 'openapi.createOrUpdateLead',
    },
  ],
};
