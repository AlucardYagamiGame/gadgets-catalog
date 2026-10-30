import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

import type { OutputBundle, OutputChunk } from 'rollup';
import type { Plugin } from 'vite';

interface PageRoute {
  directory: string;
  paths?: string[];
  prefix?: string;
}

const PAGE_ROUTES: PageRoute[] = [
  { directory: '/pages/HomePage/', paths: ['/'] },
  {
    directory: '/pages/CatalogPage/',
    paths: ['/phones', '/tablets', '/accessories'],
  },
  { directory: '/pages/ProductDetailsPage/', prefix: '/product/' },
];

const collectAssets = (
  chunk: OutputChunk,
  bundle: OutputBundle,
  seen: Set<string>,
) => {
  if (seen.has(chunk.fileName) || chunk.isEntry) {
    return;
  }

  seen.add(chunk.fileName);
  chunk.imports.forEach((name) => {
    const imported = bundle[name];

    if (imported?.type === 'chunk') {
      collectAssets(imported, bundle, seen);
    }
  });
};

const preloadPageChunks = (): Plugin => ({
  name: 'preload-page-chunks',
  transformIndexHtml: {
    order: 'post',
    handler(html, context) {
      const { bundle } = context;

      if (!bundle) {
        return html;
      }

      const chunks = Object.values(bundle).filter(
        (item): item is OutputChunk => item.type === 'chunk',
      );
      const exact: Record<string, string[][]> = {};
      const prefixes: Record<string, string[][]> = {};

      PAGE_ROUTES.forEach((route) => {
        const page = chunks.find((chunk) =>
          chunk.facadeModuleId?.includes(route.directory),
        );

        if (!page) {
          return;
        }

        const files = new Set<string>();

        collectAssets(page, bundle, files);

        const entries: string[][] = [...files].flatMap((file) => {
          const chunk = bundle[file];
          const styles =
            chunk?.type === 'chunk' ?
              [...(chunk.viteMetadata?.importedCss ?? [])]
            : [];

          return [
            ['modulepreload', file],
            ...styles.map((style) => ['style', style]),
          ];
        });

        route.paths?.forEach((path) => {
          exact[path] = entries;
        });

        if (route.prefix) {
          prefixes[route.prefix] = entries;
        }
      });

      const script = `(function(){var p=location.pathname;var e=${JSON.stringify(exact)};var x=${JSON.stringify(prefixes)};var l=e[p];if(!l){for(var k in x){if(p.indexOf(k)===0){l=x[k];break}}}if(!l)return;l.forEach(function(i){var a=document.createElement('link');if(i[0]==='style'){a.rel='preload';a.as='style'}else{a.rel='modulepreload'}a.href='/'+i[1];a.crossOrigin='';document.head.appendChild(a)})})();`;

      return [{ tag: 'script', children: script, injectTo: 'head-prepend' }];
    },
  },
});

const DEV_API_ROUTES = [
  { path: '/api/ai', file: '/api/ai.ts' },
  { path: '/api/nova-poshta', file: '/api/nova-poshta.ts' },
];

const DEV_API_KEYS = ['OPENROUTER_API_KEY', 'NOVA_POSHTA_API_KEY'];

const devApi = (): Plugin => ({
  name: 'dev-api',
  configureServer(server) {
    const env = loadEnv(server.config.mode, process.cwd(), '');

    DEV_API_KEYS.forEach((key) => {
      if (!process.env[key] && env[key]) {
        process.env[key] = env[key];
      }
    });

    DEV_API_ROUTES.forEach(({ path, file }) => {
      server.middlewares.use(path, (req, res) => {
        const chunks: Buffer[] = [];

        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          void (async () => {
            const request = req as typeof req & { body?: string };

            request.body = Buffer.concat(chunks).toString('utf8');

            const module = await server.ssrLoadModule(file);

            await (
              module.default as (
                request: typeof req,
                response: typeof res,
              ) => Promise<void>
            )(request, res);
          })();
        });
      });
    });
  },
});

export default defineConfig(({ mode }) => ({
  plugins: [react(), preloadPageChunks(), devApi()],
  base: '/',
  server: {
    open: true,
  },
  css: {
    modules: {
      generateScopedName:
        mode === 'development' ? '[name]__[local]' : '[hash:base64:6]',
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));
