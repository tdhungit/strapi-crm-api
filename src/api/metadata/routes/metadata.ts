export default {
  routes: [
    {
      method: 'GET',
      path: '/metadata/content-types',
      handler: 'metadata.getContentTypes',
      config: {},
    },
    {
      method: 'GET',
      path: '/metadata/content-types/:uid/configuration',
      handler: 'metadata.getContentTypeConfiguration',
      config: {},
    },
    {
      method: 'GET',
      path: '/metadata/components',
      handler: 'metadata.getAllComponents',
      config: {},
    },
  ],
};
