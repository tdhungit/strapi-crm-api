export default {
  routes: [
    {
      method: 'POST',
      path: '/campaigns/:id/actions/:actionId/run',
      handler: 'campaign.runAction',
    },
  ],
};
