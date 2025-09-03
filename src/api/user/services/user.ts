import { PermissionItemType } from '../../department/types';
import { UserMembersType } from '../types';

export default () => ({
  async assignFilter(userId, collectionName, action: string = 'read') {
    // get content type information
    const model = Object.values(strapi.contentTypes).find(
      (ct) => ct.collectionName === collectionName
    );
    // check assigned_user field exist
    if (model && model.attributes.assigned_user) {
      return await this.generateAssignFilter(userId, model, action);
    }

    return {};
  },

  async generateAssignFilter(userId, model: any, action: string = 'read') {
    // get all members
    const { members, manager } = await this.getUserMembers(userId);
    // get permissions
    const permissions: PermissionItemType = await strapi
      .service('api::department.department')
      .getPermissionsForUser(manager, model.uid);
    // get permission type
    const permission: PermissionItemType = permissions[model.uid];
    const permissionType = permission?.permissions?.[action]?.type || 'org';
    // filter assign user
    if (permissionType === 'me') {
      return {
        assigned_user: { id: manager.id },
      };
    }

    if (permissionType === 'org') {
      const memberIds = members.map((member) => member.id);
      return {
        assigned_user: { id: { $in: memberIds } },
      };
    }

    return {};
  },

  async getUserMembers(userId): Promise<UserMembersType> {
    // get user
    const user = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({
        where: {
          id: userId,
        },
        select: ['id', 'username', 'email'],
        populate: ['department'],
      });

    if (!user) {
      return {
        manager: null,
        members: [],
      };
    }

    // Recursively get users whose manager is userId
    async function getRecursiveMembers(managerId) {
      const users = await strapi.db
        .query('plugin::users-permissions.user')
        .findMany({
          filters: { manager: managerId },
          select: ['id', 'username', 'email'],
        });

      let allMembers = [...users];
      for (const user of users) {
        const subMembers = await getRecursiveMembers(user.id);
        allMembers = allMembers.concat(subMembers);
      }
      return allMembers;
    }

    const members = await getRecursiveMembers(userId);

    return {
      manager: user,
      members: [user, ...members],
    };
  },
});
