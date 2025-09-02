export default () => ({
  async assignFilter(userId, collectionName) {
    // get content type information
    const model = Object.values(strapi.contentTypes).find(
      (ct) => ct.collectionName === collectionName
    );
    // check assigned_user field exist
    if (model && model.attributes.assigned_user) {
      return await this.generateAssignFilter(userId);
    }

    return {};
  },

  async generateAssignFilter(userId) {
    // get all members
    const members = await this.getUserMembers(userId);
    const memberIds = members.map((member) => member.id);
    return {
      assigned_user: { id: { $in: memberIds } },
    };
  },

  async getUserMembers(userId) {
    // get user
    const user = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({
        where: {
          id: userId,
        },
        select: ['id', 'username', 'email'],
      });

    if (!user) {
      return [];
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

    return [user, ...members];
  },
});
