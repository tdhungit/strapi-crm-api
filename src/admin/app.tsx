import type { StrapiApp } from '@strapi/strapi/admin';
import {
  default as AuthLogo,
  default as MenuLogo,
} from './extensions/logo.svg';

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],

    auth: {
      logo: AuthLogo,
    },

    menu: {
      logo: MenuLogo,
    },
  },

  bootstrap(app: StrapiApp) {
    // console.log('logs', app);
  },
};
