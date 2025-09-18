import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('image-display', './image-display/imageDisplay.tsx'),
] satisfies RouteConfig;
