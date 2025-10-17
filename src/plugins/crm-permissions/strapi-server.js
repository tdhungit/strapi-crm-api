const permissions = require('./controllers/permissions');

module.exports = () => {
  return {
    register() {},
    bootstrap() {},
    routes: [
      {
        method: 'GET',
        path: '/departments',
        handler: 'permissions.getDepartments',
      },
      {
        method: 'GET',
        path: '/departments/:id/permissions',
        handler: 'permissions.getDepartmentPermissions',
      },
      {
        method: 'POST',
        path: '/departments/:id/permissions',
        handler: 'permissions.saveDepartmentPermissions',
      },
    ],
    controllers: {
      ...permissions,
    },
  };
};
