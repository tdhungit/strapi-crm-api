export default {
  routes: [
    {
      method: 'POST',
      path: '/webhooks/sendgrid',
      handler: 'webhook.sendgridEvent',
    },
  ],
};
