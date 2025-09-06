export default {
  routes: [
    {
      method: 'GET',
      path: '/address/countries',
      handler: 'address.getCountries',
    },
    {
      method: 'GET',
      path: '/address/countries/:country/states',
      handler: 'address.getStates',
    },
    {
      method: 'GET',
      path: '/address/states/:state/cities',
      handler: 'address.getCities',
    },
  ],
};
