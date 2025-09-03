export interface ChildMenuType {
  key: string;
  label: string;
}

export interface MenuType {
  key: string;
  uid: string;
  name: string;
  label: string;
  weight: number;
  children?: ChildMenuType[];
  collection?: string;
  icon?: string;
  pluralName?: string;
  singularName?: string;
}
