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
    return {
      assigned_user: { id: parseInt(userId, 10) },
    };
  },
});
