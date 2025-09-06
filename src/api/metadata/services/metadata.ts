import {
  AppLogosType,
  ContentTypeConfigurationType,
  ContentTypeType,
  ContentTypeUIType,
} from '../types';

export default () => ({
  async getAllContentTypes(): Promise<ContentTypeUIType[]> {
    const contentTypes = Object.values(strapi.contentTypes).map((ct) => ({
      uid: ct.uid,
      ...ct.info,
      collectionName: ct.collectionName,
      attributes: ct.attributes,
    }));

    for await (const contentType of contentTypes) {
      const config = await this.getContentTypeConfiguration(contentType.uid);
      contentType.settings = config.settings;
    }

    return contentTypes;
  },

  async getContentTypes(excludes: string[] = []): Promise<ContentTypeType[]> {
    const contentTypes = Object.values(strapi.contentTypes)
      .filter(
        (ct) =>
          (ct.uid.startsWith('api::') ||
            ct.uid === 'plugin::users-permissions.user') &&
          !excludes.includes(ct.uid)
      ) // chỉ lấy custom content types và users
      .map((ct) => ({
        uid: ct.uid, // ví dụ: "api::account.account"
        name: ct.info.displayName, // ví dụ: "Account"
        singularName: ct.info.singularName,
        pluralName: ct.info.pluralName,
        attributes: ct.attributes,
      }));

    return contentTypes;
  },

  async getContentTypeFromCollectionName(
    collectionName
  ): Promise<ContentTypeType> {
    const contentType = Object.values(strapi.contentTypes).find(
      (ct) => ct.collectionName === collectionName
    );

    return contentType;
  },

  async getContentTypeConfiguration(
    uid
  ): Promise<ContentTypeConfigurationType> {
    const config = await strapi.db.query('strapi::core-store').findOne({
      where: {
        key: `plugin_content_manager_configuration_content_types::${uid}`,
      },
    });

    if (!config) {
      return {
        uid,
        collectionName: uid,
        settings: {},
        metadatas: {},
        layouts: {},
        attributes: {},
      };
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
      attributes: schema.attributes || {},
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

  async getLogo(): Promise<AppLogosType> {
    const branding = await strapi.db.query('strapi::core-store').findOne({
      where: {
        key: `core_admin_project-settings`,
      },
    });

    if (!branding) {
      return {
        menuLogo: {
          name: '',
          hash: '',
          url: '',
          width: 0,
          height: 0,
          ext: '',
          size: 0,
          provider: '',
        },
        authLogo: {
          name: '',
          hash: '',
          url: '',
          width: 0,
          height: 0,
          ext: '',
          size: 0,
          provider: '',
        },
      };
    }

    return branding.value;
  },
});
