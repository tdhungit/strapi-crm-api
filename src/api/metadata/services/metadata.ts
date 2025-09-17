import {
  AppLogosType,
  ComponentConfigurationType,
  ContentTypeConfigurationType,
  ContentTypeType,
  ContentTypeUIType,
} from '../types';

export default () => ({
  systemContentTypes(): string[] {
    return [
      'api::department.department',
      'api::country.country',
      'api::city.city',
      'api::state.state',
      'api::audit-log.audit-log',
      'api::import.import',
    ];
  },

  async getAllContentTypes(): Promise<ContentTypeUIType[]> {
    const systemContentTypes = this.systemContentTypes();
    const contentTypes: ContentTypeUIType[] = Object.values(
      strapi.contentTypes
    ).map((ct) => ({
      uid: ct.uid,
      ...ct.info,
      collectionName: ct.collectionName,
      attributes: ct.attributes,
      isCRM: ct.uid.startsWith('api::') && !systemContentTypes.includes(ct.uid),
    }));

    for await (const contentType of contentTypes) {
      const config = await this.getContentTypeConfiguration(contentType.uid);
      contentType.settings = config.settings;
    }

    return contentTypes;
  },

  async getContentTypes(excludes: string[] = []): Promise<ContentTypeType[]> {
    const systemContentTypes = this.systemContentTypes();
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
        isCRM: !systemContentTypes.includes(ct.uid),
      }));

    return contentTypes;
  },

  async getCRMContentTypes(): Promise<ContentTypeType[]> {
    const contentType = await this.getContentTypes();
    return contentType.filter(
      (ct) => !this.systemContentTypes().includes(ct.uid)
    );
  },

  async getContentTypeFromCollectionName(
    collectionName
  ): Promise<ContentTypeType> {
    const contentType = Object.values(strapi.contentTypes).find(
      (ct) => ct.collectionName === collectionName
    );

    return contentType;
  },

  async getContentTypeFromUid(uid): Promise<ContentTypeType> {
    const contentType = Object.values(strapi.contentTypes).find(
      (ct) => ct.uid === uid
    );

    return contentType;
  },

  async getContentTypeConfiguration(
    uid: any,
    type: string = 'content_types'
  ): Promise<ContentTypeConfigurationType> {
    const config = await strapi.db.query('strapi::core-store').findOne({
      where: {
        key: `plugin_content_manager_configuration_${type}::${uid}`,
      },
    });

    if (!config) {
      return {
        uid,
        collectionName: '',
        pluralName: '',
        settings: {},
        metadatas: {},
        layouts: {},
        attributes: {},
      };
    }

    const parsedValue = JSON.parse(config.value || '{}');

    // get schema
    let schema;
    if (type === 'content_types') {
      schema = strapi.contentType(uid);
    } else {
      schema = strapi.components[uid];
    }

    return {
      uid,
      collectionName: schema?.collectionName || '',
      pluralName: schema?.info.pluralName || '',
      settings: parsedValue.settings || {},
      metadatas: parsedValue.metadatas || {},
      layouts: parsedValue.layouts || {},
      attributes: schema?.attributes || {},
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

  async getComponentsConfiguration(): Promise<ComponentConfigurationType[]> {
    let components: ComponentConfigurationType[] = [];
    for await (const component of Object.values(strapi.components)) {
      const config = await this.getContentTypeConfiguration(
        component.uid,
        'components'
      );
      components.push({
        uid: component.uid,
        collectionName: component.collectionName,
        info: component.info,
        attributes: component.attributes,
        options: component.options,
        category: component.category,
        modelType: component.modelType,
        modelName: component.modelName,
        globalId: component.globalId,
        settings: config.settings,
      });
    }
    return components;
  },
});
