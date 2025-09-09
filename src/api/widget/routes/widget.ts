export default {
  routes: [
    {
      method: 'GET',
      path: '/widgets/:collection/count-records-by-created',
      handler: 'widget.countCollectionByCreatedAt',
    },
  ],
};
