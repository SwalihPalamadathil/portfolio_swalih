/**
 * optimize-images.js
 * Reads photos from src/assets/ (and public/), converts to WebP at multiple sizes.
 *
 * Usage:
 *   npm run optimize-images
 *
 * Outputs to:
 *   public/photos/
 *     {name}-card.webp    (~800px wide, quality 75, target <100 KB each)
 *     {name}-lb.webp      (~1600px wide, quality 78, target <250 KB each)
 *   public/
 *     myphoto.webp        (hero portrait ~900px wide, quality 82)
 *     cammapphoto.webp    (work screenshot ~1400px wide, quality 80)
 *
 * After running, update src/data/offTheClock.js photo imports to use
 * the generated /photos/{name}-card.webp paths.
 */

import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_ASSETS = join(ROOT, 'src', 'assets');
const PUBLIC_PHOTOS = join(ROOT, 'public', 'photos');

// Photo files we want to process for the Off the Clock polaroids
const POLAROID_PHOTOS = [
  'indrustrial visit.jpg',
  'hackathon.jpg',
  'useless project.jpg',
  'internship.jpeg',
  'school nss.jpeg',
  'a rainy day.jpeg',
  'laptop.jpeg',
  'excel workshop.jpeg',
  'plus two group photo.jpeg',
];

// Public images (hero portrait, work screenshot)
const PUBLIC_IMGS = [
  { src: join(ROOT, 'public', 'myphoto.jpeg'), name: 'myphoto', maxWidth: 900, quality: 82 },
  { src: join(ROOT, 'public', 'cammapphoto.png'), name: 'cammapphoto', maxWidth: 1400, quality: 80 },
];

/**
 * Make a URL-safe slug from a filename (strip extension, replace spaces/dots)
 */
function slugify(filename) {
  return basename(filename, extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function optimizePolaroids() {
  await ensureDir(PUBLIC_PHOTOS);

  console.log('\n📸 Optimizing polaroid photos...\n');

  for (const file of POLAROID_PHOTOS) {
    const src = join(SRC_ASSETS, file);
    const slug = slugify(file);

    try {
      const img = sharp(src);
      const meta = await img.metadata();

      // Card size: ~800px wide, quality 75
      const cardOut = join(PUBLIC_PHOTOS, `${slug}-card.webp`);
      const cardWidth = Math.min(meta.width || 800, 800);
      const cardInfo = await img
        .clone()
        .resize({ width: cardWidth, withoutEnlargement: true })
        .webp({ quality: 75, effort: 4 })
        .toFile(cardOut);
      console.log(`  ✓ ${slug}-card.webp  ${(cardInfo.size / 1024).toFixed(0)} KB`);

      // Lightbox size: ~1600px wide, quality 78
      const lbOut = join(PUBLIC_PHOTOS, `${slug}-lb.webp`);
      const lbWidth = Math.min(meta.width || 1600, 1600);
      const lbInfo = await img
        .clone()
        .resize({ width: lbWidth, withoutEnlargement: true })
        .webp({ quality: 78, effort: 4 })
        .toFile(lbOut);
      console.log(`  ✓ ${slug}-lb.webp    ${(lbInfo.size / 1024).toFixed(0)} KB`);
    } catch (err) {
      console.error(`  ✗ Failed: ${file}`, err.message);
    }
  }
}

async function optimizePublicImages() {
  console.log('\n🖼  Optimizing public images...\n');

  for (const { src, name, maxWidth, quality } of PUBLIC_IMGS) {
    try {
      const img = sharp(src);
      const meta = await img.metadata();
      const width = Math.min(meta.width || maxWidth, maxWidth);

      const out = join(ROOT, 'public', `${name}.webp`);
      const info = await img
        .clone()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 4 })
        .toFile(out);
      console.log(`  ✓ ${name}.webp  ${(info.size / 1024).toFixed(0)} KB  (was ${(src.endsWith('.png') ? 472 : 376)} KB)`);
    } catch (err) {
      console.error(`  ✗ Failed: ${name}`, err.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting image optimization...');
  await optimizePolaroids();
  await optimizePublicImages();
  console.log('\n✅ Done! Update src/data/offTheClock.js to use /photos/{slug}-card.webp paths.\n');
  console.log('Slug mapping:');
  for (const file of POLAROID_PHOTOS) {
    console.log(`  ${file}  →  /photos/${slugify(file)}-card.webp`);
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
