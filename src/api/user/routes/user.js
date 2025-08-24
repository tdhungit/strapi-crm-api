module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/users',
      handler: 'user.getAllUsers',
      config: {
        policies: [],
      },
    },
  ],
};
