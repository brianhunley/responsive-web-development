import { readdirSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const skippedDirs = new Set(['node_modules', 'dist', 'grid-test']);

function collectHtmlPages(dir, pages = {}) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;

    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (skippedDirs.has(entry.name)) continue;
      collectHtmlPages(fullPath, pages);
      continue;
    }

    if (extname(entry.name) === '.html') {
      const name = relative(rootDir, fullPath)
        .replaceAll('\\', '/')
        .replace(/\.html$/, '');
      pages[name] = fullPath;
    }
  }

  return pages;
}

export default defineConfig({
  appType: 'mpa',
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
    },
  },
  plugins: [
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 70 },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
          'sortAttrs',
        ],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: [resolve(rootDir, 'src/styles')],
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: collectHtmlPages(rootDir),
    },
  },
});
