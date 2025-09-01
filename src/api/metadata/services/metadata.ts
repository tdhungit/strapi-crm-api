export default {
  async getAllContentTypes() {
    const contentTypes = Object.values(strapi.contentTypes).map((ct) => ({
      uid: ct.uid,
      ...ct.info,
      collectionName: ct.collectionName,
      fields: ct.attributes,
    }));

    for await (const contentType of contentTypes) {
      const config = await this.getContentTypeConfiguration(contentType.uid);
      contentType.settings = config.settings;
    }

    return contentTypes;
  },

  async getContentTypes() {
    const contentTypes = Object.values(strapi.contentTypes)
      .filter(
        (ct) =>
          ct.uid.startsWith('api::') ||
          ct.uid === 'plugin::users-permissions.user'
      ) // chỉ lấy custom content types và users
      .map((ct) => ({
        uid: ct.uid, // ví dụ: "api::account.account"
        name: ct.info.displayName, // ví dụ: "Account"
        singularName: ct.info.singularName,
        pluralName: ct.info.pluralName,
      }));

    return contentTypes;
  },

  async getContentTypeFromCollectionName(collectionName) {
    const contentType = Object.values(strapi.contentTypes).find(
      (ct) => ct.collectionName === collectionName
    );

    return contentType;
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
      collectionName: schema.collectionName,
      settings: parsedValue.settings || {},
      metadatas: parsedValue.metadatas || {},
      layouts: parsedValue.layouts || {},
      fields: schema.attributes || {},
    };
  },

  async fixDataSave(uid, data) {
    const fixedData = {};
    const attributes = strapi.contentType(uid).attributes;

    for (const key in data) {
      if (attributes[key]) {
        fixedData[key] = data[key];
      }
    }

    return fixedData;
  },

  async getLogo() {
    const branding = await strapi.db.query('strapi::core-store').findOne({
      where: {
        key: `core_admin_project-settings`,
      },
    });

    if (!branding) {
      return {};
    }

    return branding.value;
  },
};
