export default {
  routes: [
    {
      method: 'GET',
      path: '/audit-logs/:model/:id',
      handler: 'audit-log.getAuditLogs',
    },
  ],
};
