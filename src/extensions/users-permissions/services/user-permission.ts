import _ from 'lodash';
import urlJoin from 'url-join';
import { GetRoutesParams, GetRoutesResponse, Route, RoutesMap } from '../types';

export default {
  async getRoutes({
    page = 1,
    pageSize = 50,
    apiName,
  }: GetRoutesParams = {}): Promise<GetRoutesResponse> {
    const routesMap: RoutesMap = {};

    const transformPrefix =
      (pluginName: string) =>
      (route: any): Route => ({
        ...route,
        path: `/${pluginName}${route.path}`,
      });

    const apisToProcess = apiName
      ? { [apiName]: strapi.apis[apiName] }
      : strapi.apis;

    _.forEach(apisToProcess, (api: any, apiName: string) => {
      const routes = _.flatMap(api.routes, (route: any) => {
        if (_.has(route, 'routes')) {
          return route.routes;
        }
        return route;
      }).filter((route: any) => route.info?.type === 'content-api');

      if (routes.length === 0) {
        return;
      }

      const apiPrefix = strapi.config.get('api.rest.prefix', '/api') as string;
      routesMap[`api::${apiName}`] = routes.map(
        (route: any): Route => ({
          method: route.method,
          path: urlJoin(apiPrefix, route.path),
          handler: route.handler,
          config: route.config || {},
          info: {
            apiName,
            type: 'content-api',
          },
        })
      );
    });

    const pluginsToProcess =
      apiName && strapi.plugins[apiName]
        ? { [apiName]: strapi.plugins[apiName] }
        : strapi.plugins;

    _.forEach(pluginsToProcess, (plugin: any, pluginName: string) => {
      const transform = transformPrefix(pluginName);
      const routes = _.flatMap(plugin.routes, (route: any) => {
        if (_.has(route, 'routes')) {
          return route.routes.map(transform);
        }
        return transform(route);
      }).filter((route: any) => route.info?.type === 'content-api');

      if (routes.length === 0) {
        return;
      }

      const apiPrefix = strapi.config.get('api.rest.prefix', '/api') as string;
      routesMap[`plugin::${pluginName}`] = routes.map(
        (route: any): Route => ({
          method: route.method,
          path: urlJoin(apiPrefix, route.path),
          handler: route.handler,
          config: route.config || {},
          info: {
            apiName: pluginName,
            type: 'content-api',
          },
        })
      );
    });

    const allRoutesEntries = Object.entries(routesMap) as [string, Route[]][];
    const total = allRoutesEntries.reduce(
      (sum, [, routes]) => sum + routes.length,
      0
    );
    const start = (page - 1) * pageSize;
    let paginatedRoutes: [string, Route[]][] = [];

    let currentCount = 0;
    for (const [key, routes] of allRoutesEntries) {
      if (currentCount >= start + pageSize) break;
      if (currentCount + routes.length > start) {
        const sliceStart = Math.max(0, start - currentCount);
        const sliceEnd = Math.min(
          routes.length,
          start + pageSize - currentCount
        );
        paginatedRoutes.push([key, routes.slice(sliceStart, sliceEnd)]);
      }
      currentCount += routes.length;
    }

    return {
      routes: Object.fromEntries(paginatedRoutes),
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },
};
