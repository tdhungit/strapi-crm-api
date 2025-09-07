export default {
  routes: [
    {
      method: 'GET',
      path: '/users',
      handler: 'user.getAllUsers',
    },
    {
      method: 'PUT',
      path: '/users/me',
      handler: 'user.updateCurrentUser',
    },
    {
      method: 'GET',
      path: '/users/members/:id',
      handler: 'user.getUserMembers',
    },
  ],
};
