export default {
  routes: [
    {
      method: 'POST',
      path: '/reports/extra/generate',
      handler: 'report.generateReport',
    },
  ],
};
