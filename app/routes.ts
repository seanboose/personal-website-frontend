import { index, route, type RouteConfig } from '@react-router/dev/routes';

// TODO may want to switch this to automatically get routes from file structure
export default [
  index('routes/home.tsx'),
  route('image-display', './image-display/imageDisplay.tsx'),
  route('auth/init', 'routes/auth.init.ts'),
] satisfies RouteConfig;
