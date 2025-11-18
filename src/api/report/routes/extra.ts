export default {
  routes: [
    {
      method: 'POST',
      path: '/reports/extra/generate',
      handler: 'report.generateReport',
    },
    {
      method: 'GET',
      path: '/reports/:id/result',
      handler: 'report.getReportResult',
    },
    {
      method: 'POST',
      path: '/reports/extra/is-select-query',
      handler: 'report.isSelectQuery',
    },
  ],
};
