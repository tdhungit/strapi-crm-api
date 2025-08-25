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
    {
      method: 'POST',
      path: '/users/change-password/:id',
      handler: 'user.changeUserPassword',
      config: {
        policies: [],
      },
    },
  ],
};
