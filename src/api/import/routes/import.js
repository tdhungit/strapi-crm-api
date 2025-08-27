'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/imports/csv',
      handler: 'import.uploadCSVImport',
    },
  ],
};
