export interface PermissionActionType {
  action: string;
  type: string;
}

export interface PermissionItemType {
  collection: {
    uid: string;
    name: string;
    singularName: string;
    pluralName: string;
  };
  permissions: {
    [key: string]: PermissionActionType;
  };
}

export interface PermissionType {
  [key: string]: PermissionItemType;
}
