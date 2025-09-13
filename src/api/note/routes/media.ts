export default {
  routes: [
    {
      method: 'GET',
      path: '/medias',
      handler: 'media.findMedias',
    },
  ],
};
