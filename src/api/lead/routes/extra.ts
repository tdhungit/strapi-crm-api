export default {
  routes: [
    {
      method: 'POST',
      path: '/leads/:id/convert-to-contact',
      handler: 'lead.convertToContact',
    },
  ],
};
