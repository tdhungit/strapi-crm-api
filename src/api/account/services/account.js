'use strict';

/**
 * account service
 */
// @ts-ignore
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::account.account');
