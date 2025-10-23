import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';
import { FirebaseAppType } from '../types';

export default {
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
};
