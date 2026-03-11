/**
 * Electron Build Script
 * Uses esbuild to bundle main.ts and preload.ts
 * - main.ts -> ESM format (Electron main process supports ESM)
 * - preload.ts -> CommonJS format (required by Electron)
 */

import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const commonOptions = {
  bundle: true,
  platform: 'node',
  target: 'node18',
  sourcemap: true,
  external: ['electron'],
};

async function build() {
  // Build main process (ESM)
  await esbuild.build({
    ...commonOptions,
    entryPoints: [path.join(__dirname, 'main.ts')],
    outfile: path.join(__dirname, 'dist/main.js'),
    format: 'esm',
    banner: {
      // Polyfill __dirname for ESM in production
      js: `
import { fileURLToPath as __fileURLToPath } from 'url';
import { dirname as __dirname_fn } from 'path';
const __filename = __fileURLToPath(import.meta.url);
const __dirname = __dirname_fn(__filename);
      `.trim(),
    },
  });

  // Build preload script (CommonJS - REQUIRED by Electron)
  await esbuild.build({
    ...commonOptions,
    entryPoints: [path.join(__dirname, 'preload.ts')],
    outfile: path.join(__dirname, 'dist/preload.js'),
    format: 'cjs',
  });

  console.log('Electron build complete!');
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
