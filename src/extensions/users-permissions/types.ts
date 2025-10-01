export interface Route {
  method: string;
  path: string;
  handler: string;
  config?: {
    auth?: {
      scope?: string[];
    };
  };
  info?: {
    apiName: string;
    type: 'content-api';
  };
}

export interface RoutesMap {
  [key: `api::${string}` | `plugin::${string}`]: Route[];
}

export interface GetRoutesParams {
  page?: number;
  pageSize?: number;
  apiName?: string;
}

export interface GetRoutesResponse {
  routes: RoutesMap;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
