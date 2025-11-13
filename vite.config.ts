import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import vitePluginSvgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import { handleChromeDevtoolsRequest } from './viteHandleChromeDevtoolsRequest';

export default defineConfig({
  plugins: [
    vitePluginSvgr(),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    handleChromeDevtoolsRequest(),
  ],
});
