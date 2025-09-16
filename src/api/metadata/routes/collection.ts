export default {
  routes: [
    {
      method: 'PUT',
      path: '/collections/:collectionName/bulk-update',
      handler: 'collection.bulkUpdateCollection',
    },
  ],
};
