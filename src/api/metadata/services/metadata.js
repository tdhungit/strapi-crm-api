'use strict';

module.exports = () => ({
  async getAllContentTypes() {
    const contentTypes = Object.values(strapi.contentTypes).map((ct) => ({
      uid: ct.uid,
      ...ct.info,
      collectionName: ct.collectionName,
      fields: ct.attributes,
    }));

    return contentTypes;
  },

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

  async getContentTypeConfiguration(uid) {
    const config = await strapi.db.query('strapi::core-store').findOne({
      where: {
        key: `plugin_content_manager_configuration_content_types::${uid}`,
      },
    });

    if (!config) {
      return {};
    }

    const parsedValue = JSON.parse(config.value || '{}');

    // get schema
    const schema = await strapi.contentType(uid);

    return {
      uid,
      settings: parsedValue.settings || {},
      metadatas: parsedValue.metadatas || {},
      layouts: parsedValue.layouts || {},
      fields: schema.attributes || {},
    };
  },
});
