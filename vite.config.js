import { defineConfig } from 'vite';
import { readdirSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';

function collectHtmlFiles(dir, root, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (['node_modules', '.git', 'dist'].includes(entry)) continue;
    const fullPath = resolve(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      collectHtmlFiles(fullPath, root, acc);
      continue;
    }
    if (entry.endsWith('.html')) {
      acc.push(relative(root, fullPath));
    }
  }
  return acc;
}

const rootDir = process.cwd();
const htmlFiles = collectHtmlFiles(rootDir, rootDir);
const input = Object.fromEntries(
  htmlFiles.map((file) => {
    const normalized = file.replace(/\\/g, '/');
    const key = normalized === 'index.html' ? 'index' : normalized.replace(/\.html$/, '');
    return [key, resolve(rootDir, normalized)];
  })
);

export default defineConfig({
  build: {
    rollupOptions: {
      input,
    },
  },
});
