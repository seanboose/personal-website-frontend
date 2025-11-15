import {
  index,
  layout,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';

export default [
  layout('routes/_layout/route.tsx', [
    index('routes/_layout._index.tsx'),
    route('image-display', 'routes/_layout.image-display/route.tsx'),
  ]),
  route('auth/init', 'routes/auth.init.ts'),
] satisfies RouteConfig;

export const routes = {
  imageDisplay: '/image-display',
  home: '/',
  login: '/auth/init',
};
