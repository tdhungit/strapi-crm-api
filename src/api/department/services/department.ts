import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::department.department',
  ({ strapi }) => ({
    getPermissionTypes() {
      return ['org', 'me', 'all'];
    },

    async getPermissions(departmentId: number) {
      const contentTypes = await strapi
        .service('api::metadata.metadata')
        .getContentTypes();

      const permissionContentTypes = contentTypes.filter(
        (item) => item.attributes.assigned_user !== undefined
      );

      let permissions = {};
      permissionContentTypes.forEach((item) => {
        if (!permissions[item.uid]) {
          permissions[item.uid] = {
            collection: {
              uid: item.uid,
              name: item.name,
              singularName: item.singularName,
              pluralName: item.pluralName,
            },
            permissions: {},
          };
        }

        permissions[item.uid].permissions.read = {
          action: 'read',
          type: 'org',
        };
        permissions[item.uid].permissions.update = {
          action: 'update',
          type: 'org',
        };
        permissions[item.uid].permissions.delete = {
          action: 'delete',
          type: 'org',
        };
      });

      const department = await strapi.db
        .query('api::department.department')
        .findOne({
          where: {
            id: departmentId,
          },
        });

      if (!department) {
        return permissions;
      }

      if (department.permissions) {
        for (const uid in department.permissions) {
          for (const action in department.permissions[uid]) {
            permissions[uid][action] = department.permissions[uid][action];
          }
        }
      }

      return permissions;
    },
  })
);
