export default {
  routes: [
    {
      method: 'GET',
      path: '/crm-workflows/extra/actions',
      handler: 'crm-workflow.getAllActions',
    },
  ],
};
