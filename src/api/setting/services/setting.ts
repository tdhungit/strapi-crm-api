import { factories } from '@strapi/strapi';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';
import { ContentTypeType } from '../../metadata/types';
import { MenuType } from '../types';
import { FirebaseAppType } from './../types';

export default factories.createCoreService(
  'api::setting.setting',
  ({ strapi }) => ({
    async getDefaultMenus(): Promise<MenuType[]> {
      // get content types
      const contentTypes: ContentTypeType[] = await strapi
        .service('api::metadata.metadata')
        .getContentTypes();

      let menus = [];
      let weight = 1;
      contentTypes.forEach((item) => {
        if (
          !strapi
            .service('api::metadata.metadata')
            .systemContentTypes()
            .includes(item.uid)
        ) {
          menus.push({
            ...item,
            key: '/collections/' + item.pluralName,
            label: item.name,
            collection: item.pluralName,
            weight,
          });
          weight++;
        }
      });

      return menus;
    },

    async getAvailableMenus(): Promise<MenuType[]> {
      let menus = [];
      const settingMenus = await strapi.db
        .query('api::setting.setting')
        .findOne({
          where: {
            category: 'system',
            name: 'menu',
          },
        });

      if (
        settingMenus &&
        settingMenus.values &&
        settingMenus.values.length > 0
      ) {
        settingMenus.values.forEach((item) => {
          menus.push(item);
        });
      }

      // sort by weight
      menus.sort((a, b) => a.weight - b.weight);

      return menus;
    },

    async getHiddenMenus(): Promise<MenuType[]> {
      const defaultMenus = await this.getDefaultMenus();
      const availableMenus = await this.getAvailableMenus();

      let hiddenMenus = defaultMenus.filter((item) => {
        // find item key in available menus
        return !availableMenus.find((menu) => menu.key === item.key);
      });

      return hiddenMenus;
    },

    async getSettings(
      category: string,
      name: string = '',
      user: any = {},
    ): Promise<{ [key: string]: any }> {
      const where: { category: string; name?: string; user?: any } = {
        category,
      };

      if (name) {
        where.name = name;
      }

      if (user?.id && category !== 'system') {
        where.user = {
          id: user.id,
        };
      }

      const settings = await strapi.db.query('api::setting.setting').findMany({
        where,
      });

      const result = {};
      settings.forEach((item) => {
        result[item.name] = item.values;
      });

      return result;
    },

    async updateSettings(
      category: string,
      body: { [key: string]: any },
      user?: any,
    ): Promise<{ [key: string]: any }> {
      for (let key in body) {
        const where: { category: string; name: string; user?: any } = {
          category,
          name: key,
        };

        if (user?.id && category !== 'system') {
          where.user = {
            id: user.id,
          };
        }

        // find setting
        const setting = await strapi.db.query('api::setting.setting').findOne({
          where,
        });

        if (setting) {
          await strapi.db.query('api::setting.setting').update({
            where,
            data: {
              category,
              name: key,
              values: body[key],
            },
          });
        } else {
          await strapi.db.query('api::setting.setting').create({
            data: {
              category,
              name: key,
              values: body[key],
              user: user?.id || null,
            },
          });
        }
      }

      return this.getSettings(category);
    },

    async getFirebaseApp(): Promise<FirebaseAppType> {
      // Get firebase settings
      const firebaseConfig = await strapi
        .service('api::setting.setting')
        .getSettings('system', 'firebase');

      if (!firebaseConfig?.firebase?.serviceAccountJson) {
        throw new Error('Firebase settings not found');
      }

      const serviceAccount = JSON.parse(
        fs.readFileSync(firebaseConfig.firebase.serviceAccountJson, 'utf8'),
      );

      const options = {};
      if (firebaseConfig.firebase.databaseURL) {
        options['databaseURL'] = firebaseConfig.firebase.databaseURL;
      }

      const app = !getApps().length
        ? initializeApp({
            credential: cert(serviceAccount),
            ...options,
          })
        : getApp();

      return { app, auth: getAuth(), database: getDatabase() };
    },
  }),
);
