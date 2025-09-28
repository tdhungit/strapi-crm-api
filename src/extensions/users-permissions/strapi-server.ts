import userPermissionController from './controllers/user-permissions';

export default (plugin: any) => {
  plugin.controllers.permissions.getRoutes = userPermissionController.getRoutes;

  plugin.controllers.permissions.findOne = userPermissionController.findOne;

  // plugin.routes.admin.routes.map((route: any) => {
  //   console.log(route.method, route.path, route.handler);
  // });

  return plugin;
};
