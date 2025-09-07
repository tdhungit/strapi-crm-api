import { PermissionItemType, PermissionType } from '../../department/types';
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

  async generateAssignFilter(
    userId,
    model: any,
    action: string = 'read',
    filters: any = {}
  ) {
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
    let assignedFilter = {};
    switch (permissionType) {
      case 'me':
        assignedFilter = {
          assigned_user: { id: manager.id },
        };
        break;
      case 'org':
        const memberIds = members.map((member) => member.id);
        assignedFilter = {
          assigned_user: { id: { $in: memberIds } },
        };
        break;
      default:
        break;
    }

    if (!filters?.assigned_user) {
      return assignedFilter;
    }

    return {
      $and: [filters, assignedFilter],
    };
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

  async getPermissions(user, uid): Promise<PermissionType> {
    return await strapi
      .service('api::department.department')
      .getPermissionsForUser(user, uid);
  },

  async isAccessRecord(
    userId,
    uid,
    record: any,
    action: string = 'read',
    user: any = null
  ): Promise<boolean> {
    if (action === 'read' && record.assigned_user?.id === userId) {
      return true;
    }

    if (!user) {
      user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          id: userId,
        },
        populate: ['department'],
      });
    }

    const permissions = await this.getPermissions(user, uid);
    const permission = permissions[uid]?.permissions?.[action]?.type || 'org';

    if (permission === 'all') {
      return true;
    }

    if (permission === 'me') {
      return userId === user.id;
    }

    if (permission === 'org') {
      const members = await this.getUserMembers(userId);
      const member = members.members.find((member) => member.id === userId);
      return !!member;
    }

    return true;
  },
});
