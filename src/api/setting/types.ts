import { App } from 'firebase-admin/app';
import { Auth } from 'firebase-admin/auth';
import { Database } from 'firebase-admin/database';

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

export interface FirebaseAppType {
  app: App;
  auth: Auth;
  database: Database;
}
