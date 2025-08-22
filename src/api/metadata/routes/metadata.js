module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/metadata/content-types',
      handler: 'metadata.getContentTypes',
      config: {
        auth: false, // set true nếu bắt buộc login
      },
    },
  ],
};
