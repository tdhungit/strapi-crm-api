export default {
  routes: [
    {
      method: 'POST',
      path: '/customers/contact/check-email',
      handler: 'customer.checkContactEmailExist',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/customers/contact/register',
      handler: 'customer.contactRegister',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/customers/contact/login',
      handler: 'customer.contactLogin',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/customers/contact/firebase-config',
      handler: 'customer.getFirebaseConfig',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/customers/contact/chatbox-config',
      handler: 'customer.getChatBoxConfig',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/customers/contact/social-merge-to-local',
      handler: 'customer.contactMergeSocial2Local',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/customers/contact/me',
      handler: 'customer.contactCurrent',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/contact/change-password',
      handler: 'customer.changePassword',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
  ],
};
