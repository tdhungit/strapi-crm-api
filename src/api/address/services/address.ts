import axios from 'axios';

export default () => ({
  async importAddressData() {
    const jsonUrl =
      'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json';
    const response = await axios.get(jsonUrl);
    for await (const countryData of response.data) {
      // create or update country
      const updateCountryData = {
        name: countryData.name,
        iso2: countryData.iso2,
        iso3: countryData.iso3,
        phonecode: countryData.phonecode,
        region: countryData.region,
        timezones: countryData.timezones,
        latitude: countryData.latitude,
        longitude: countryData.longitude,
        capital: countryData.capital,
        currency: countryData.currency,
        currency_symbol: countryData.currency_symbol,
        currency_name: countryData.currency_name,
      };
      // find country
      let country = await strapi.db.query('api::country.country').findOne({
        where: {
          name: countryData.name,
        },
      });

      if (!country) {
        country = await strapi.db.query('api::country.country').create({
          data: updateCountryData,
        });
      } else {
        await strapi.db.query('api::country.country').update({
          where: {
            id: country.id,
          },
          data: updateCountryData,
        });
      }

      for await (const stateData of countryData.states) {
        // create or update state
        const updateStateData = {
          name: stateData.name,
          code: stateData.iso2,
          country: country.id,
          latitude: stateData.latitude,
          longitude: stateData.longitude,
          type: stateData.type,
          timezone: stateData.timezone,
        };
        // find state
        let state = await strapi.db.query('api::state.state').findOne({
          where: {
            name: stateData.name,
            country: {
              id: country.id,
            },
          },
        });

        if (!state) {
          state = await strapi.db.query('api::state.state').create({
            data: updateStateData,
          });
        } else {
          await strapi.db.query('api::state.state').update({
            where: {
              id: state.id,
            },
            data: updateStateData,
          });
        }

        for await (const cityData of stateData.cities) {
          // create or update city
          const updateCityData = {
            name: cityData.name,
            state: state.id,
            latitude: stateData.latitude,
            longitude: stateData.longitude,
          };
          // find city
          let city = await strapi.db.query('api::city.city').findOne({
            where: {
              name: stateData.name,
              state: {
                id: state.id,
              },
            },
          });

          if (!city) {
            city = await strapi.db.query('api::city.city').create({
              data: updateCityData,
            });
          } else {
            await strapi.db.query('api::city.city').update({
              where: {
                id: city.id,
              },
              data: updateCityData,
            });
          }
        }
      }
    }
  },

  async getAddressStatistics() {
    const countryCount = await strapi.db.query('api::country.country').count();
    const stateCount = await strapi.db.query('api::state.state').count();
    const cityCount = await strapi.db.query('api::city.city').count();

    return {
      countryCount,
      stateCount,
      cityCount,
    };
  },
});
