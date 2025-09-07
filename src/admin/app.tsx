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

    theme: {
      dark: {
        colors: {
          alternative100: '#f6ecfc',
          alternative200: '#e0c1f4',
          alternative500: '#ac73e6',
          alternative600: '#9736e8',
          alternative700: '#8312d1',
          buttonNeutral0: '#ffffff',
          buttonPrimary500: '#7b79ff',
        },
      },
      light: {},
    },

    translations: {
      en: {
        'app.name': 'Strapi CRM',
        'Auth.form.welcome.subtitle': 'Log in to your Strapi CRM account',
        'Auth.form.welcome.title': 'Welcome to Strapi CRM!',
      },
    },
  },

  bootstrap(app: StrapiApp) {
    // console.log('logs', app);
  },
};
