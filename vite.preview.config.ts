import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';

import { defineConfig } from 'vite';

// Serve the static output with directory redirects, without a SPA catch-all.
export default defineConfig({
  appType: 'mpa',
  build: { outDir: 'build/client' },
  plugins: [
    {
      name: 'prerendered-directory-redirects',
      configurePreviewServer(server) {
        const output = resolve(server.config.root, server.config.build.outDir);
        server.middlewares.use((request, response, next) => {
          const url = new URL(request.url ?? '/', 'http://localhost');
          if (
            !['GET', 'HEAD'].includes(request.method ?? '') ||
            url.pathname.endsWith('/')
          ) {
            return next();
          }
          let pathname: string;
          try {
            pathname = decodeURIComponent(url.pathname);
          } catch {
            return next();
          }
          const index = resolve(output, `.${pathname}`, 'index.html');
          if (!index.startsWith(`${output}${sep}`) || !existsSync(index))
            return next();
          url.pathname += '/';
          response.writeHead(308, { Location: url.pathname + url.search });
          response.end();
        });
      },
    },
  ],
});
