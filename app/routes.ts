import { type RouteConfig } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

export default flatRoutes() satisfies RouteConfig;

export const routes = {
  imageDisplay: '/image-display',
  home: '/',
  login: '/auth/init',
};
