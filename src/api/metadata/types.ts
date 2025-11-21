export interface AttributeType {
  type: string;
  [key: string]: any;
}

export interface AttributesType {
  [key: string]: AttributeType;
}

export interface ContentTypeSettingsType {
  bulkable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  pageSize?: number;
  mainField?: string;
  defaultSortBy?: string;
  defaultSortOrder?: string;
}

export interface ContentTypeUIType {
  uid: string;
  collectionName: string;
  attributes: AttributesType;
  singularName: string;
  pluralName: string;
  displayName: string;
  description: string;
  settings: ContentTypeSettingsType;
  isCRM?: boolean;
}

export interface ContentTypeType {
  uid: string;
  name: string;
  singularName: string;
  pluralName: string;
  attributes: AttributesType;
  isCRM?: boolean;
  info?: any;
}

export interface ContentTypeConfigurationType {
  uid: string;
  collectionName: string;
  pluralName: string;
  settings: ContentTypeSettingsType;
  metadatas: any;
  layouts: any;
  attributes: AttributesType;
}

export interface AppLogoType {
  name: string;
  hash: string;
  url: string;
  width: number;
  height: number;
  ext: string;
  size: number;
  provider: string;
}

export interface AppLogosType {
  menuLogo: AppLogoType;
  authLogo: AppLogoType;
}

export interface ComponentConfigurationType {
  uid: string;
  collectionName: string;
  info: {
    displayName: string;
    icon: string;
  };
  attributes: AttributesType;
  options: any;
  category: string;
  modelType: string;
  modelName: string;
  globalId: string;
  settings?: ContentTypeSettingsType;
}
