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
      light: {
        colors: {
          primary100: '#FFEDD5',
          primary200: '#FDBA74',
          primary500: '#F97316', // màu chính
          primary600: '#FB923C', // hover/active
          primary700: '#EA580C', // nhấn đậm
          buttonPrimary500: '#F97316',
          buttonPrimary600: '#FB923C',
        },
      },
      dark: {
        colors: {
          primary100: '#5C2E0F', // thay cho 431407, sáng hơn
          primary200: '#7C3A0A',
          primary500: '#F97316',
          primary600: '#FB923C',
          primary700: '#EA580C',
          buttonPrimary500: '#F97316',
          buttonPrimary600: '#FB923C',
        },
      },
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
