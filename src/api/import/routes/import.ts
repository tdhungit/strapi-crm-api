export default {
  routes: [
    {
      method: 'POST',
      path: '/imports/csv',
      handler: 'import.uploadCSVImport',
    },
    {
      method: 'GET',
      path: '/exports/csv/:module',
      handler: 'import.exportToCSV',
    },
  ],
};
