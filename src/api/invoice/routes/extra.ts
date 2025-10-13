export default {
  routes: [
    {
      method: 'GET',
      path: '/invoices/:id/html',
      handler: 'invoice.renderHtml',
    },
  ],
};
