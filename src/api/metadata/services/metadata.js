'use strict';

module.exports = () => ({
  async getContentTypes() {
    const contentTypes = Object.values(strapi.contentTypes)
      .filter((ct) => ct.uid.startsWith('api::') || ct.uid === 'plugin::users-permissions.user') // chỉ lấy custom content types và users
      .map((ct) => ({
        uid: ct.uid, // ví dụ: "api::account.account"
        name: ct.info.displayName, // ví dụ: "Account"
        singularName: ct.info.singularName,
        pluralName: ct.info.pluralName,
      }));

    return contentTypes;
  },
});
