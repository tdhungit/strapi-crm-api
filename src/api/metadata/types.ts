export interface ContentTypeUIType {
  uid: string;
  collectionName: string;
  fields: any;
  singularName: string;
  pluralName: string;
  displayName: string;
  description: string;
  settings: {
    bulkable: boolean;
    filterable: boolean;
    searchable: boolean;
    pageSize: number;
    mainField: string;
    defaultSortBy: string;
    defaultSortOrder: string;
  };
}

export interface ContentTypeType {
  uid: string;
  name: string;
  singularName: string;
  pluralName: string;
  attributes: any;
}

export interface ContentTypeConfigurationType {
  uid: string;
  collectionName: string;
  settings: any;
  metadatas: any;
  layouts: any;
  fields: any;
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
