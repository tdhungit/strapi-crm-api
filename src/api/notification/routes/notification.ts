export default {
  routes: [
    {
      method: 'POST',
      path: '/notifications/send',
      handler: 'notification.send',
    },
  ],
};
