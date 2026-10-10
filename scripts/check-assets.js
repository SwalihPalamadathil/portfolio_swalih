import { existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const PUBLIC = join(ROOT, 'public');

let hasErrors = false;

function checkPath(path, source) {
  if (!path || typeof path !== 'string') return;
  if (path.startsWith('http') || path.startsWith('//')) return;
  if (!path.match(/\.(webp|jpg|jpeg|png|gif|svg|avif)$/i)) return;
  let resolved;
  if (path.startsWith('/')) {
    resolved = join(PUBLIC, path.replace(/^\//, ''));
  } else {
    resolved = join(ROOT, path.replace(/^\.\//, ''));
  }
  if (!existsSync(resolved)) {
    console.error('MISSING ASSET: "' + path + '" (from ' + source + ')');
    console.error('  Expected at: ' + resolved);
    hasErrors = true;
  }
}

async function main() {
  const { photos } = await import('../src/data/offTheClock.js');
  console.log('Checking offTheClock.js photo paths...');
  for (const photo of photos) {
    checkPath(photo.src, 'offTheClock[' + photo.id + '].src');
    checkPath(photo.srcLb, 'offTheClock[' + photo.id + '].srcLb');
  }
  console.log('Checking hero images...');
  ['/myphoto.webp', '/myphoto-sm.webp'].forEach((p) => checkPath(p, 'index.html'));
  if (hasErrors) {
    console.error('BUILD ABORTED: Fix missing assets. Run npm run optimize-images.');
    process.exit(1);
  } else {
    console.log('All referenced assets exist. Build proceeding...');
  }
}

main().catch((err) => { console.error('Asset check failed:', err.message); process.exit(1); });
