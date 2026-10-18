#!/usr/bin/env node
/**
 * Photo ingestion: source images (HEIC/JPEG/PNG) -> web-ready WebP + a data module.
 *
 * sharp reads HEIC directly via libvips, so iPhone photos need no pre-conversion.
 * `.rotate()` with no argument applies the EXIF orientation and strips the tag, which
 * matters because phone photos are almost always stored sideways with a rotation flag.
 *
 * Intrinsic dimensions are written into the generated data module rather than typed by
 * hand: every <img> on the site carries explicit width/height to prevent layout shift,
 * and 31 hand-written pairs is 31 chances to be wrong.
 *
 * photos.js is rewritten wholesale, so every manifest that feeds it has to be passed on
 * the same run. Each manifest carries its own `src` root; --src only covers one that
 * doesn't.
 *
 *   node scripts/images.mjs --manifest scripts/manifests/oct-2026.json \
 *                           --manifest scripts/manifests/instagram-2026.json
 *   node scripts/images.mjs ... --dry
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);

const LONG_EDGE = 1200;  // matches the existing food-6/7/8 profile
const QUALITY = 72;      // visually clean; ~110-170KB for dense food textures
const OUT_ROOT = 'assets/images';
const DATA_OUT = 'src/data/photos.js';

/**
 * sharp's prebuilt libvips reports HEIF support but ships without the HEVC decoder
 * (libde265), so iPhone .HEIC files fail with "Support for this compression format
 * has not been built in". macOS `sips` decodes HEVC natively, so we shim through it
 * and hand sharp a PNG.
 *
 * Phase 2 note: this path is macOS-only. It isn't needed on the server - browsers
 * convert HEIC to JPEG on upload - but if that changes, swap in a libheif build
 * rather than reaching for sips on Linux.
 */
const HEIC = /\.(heic|heif)$/i;

async function decode(src) {
  if (!HEIC.test(src)) return src;
  if (process.platform !== 'darwin') {
    throw new Error('HEIC input needs macOS sips, or a libvips build with libde265');
  }
  const tmp = path.join(os.tmpdir(), `veganish-${Date.now()}-${Math.random().toString(36).slice(2)}.png`);
  await run('sips', ['-s', 'format', 'png', src, '--out', tmp]);
  return tmp;
}

const args = {};
const manifestPaths = [];
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const next = argv[i + 1];
    // a flag with no value (or followed by another flag) is boolean true
    const value = next === undefined || next.startsWith('--') ? true : next;
    if (a === '--manifest') manifestPaths.push(value);
    else args[a.slice(2)] = value;
  }
}

if (!manifestPaths.length) {
  console.error('usage: node scripts/images.mjs --manifest <file.json> [--manifest ...] [--src <dir>] [--dry]');
  process.exit(1);
}

/**
 * `aspect` ("3:4") re-frames a photo that doesn't suit the grid - Instagram reel covers
 * arrive 9:16. sharp's attention strategy keeps the busiest region, which on a plated
 * dish is the food. Without it the photo keeps its own proportions.
 */
function sizing(aspect) {
  if (!aspect) return { width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true };
  const [w, h] = String(aspect).split(':').map(Number);
  if (!w || !h) throw new Error(`bad aspect "${aspect}" - expected W:H`);
  return {
    width: w >= h ? LONG_EDGE : Math.round((LONG_EDGE * w) / h),
    height: w >= h ? Math.round((LONG_EDGE * h) / w) : LONG_EDGE,
    fit: 'cover',
    position: sharp.strategy.attention,
  };
}

const manifests = [];
for (const p of manifestPaths) {
  const m = JSON.parse(await readFile(p, 'utf8'));
  const root = m.src ?? args.src;
  if (!root) {
    console.error(`${p}: no "src" in the manifest and no --src given`);
    process.exit(1);
  }
  // src roots are written relative to the repo root, the same way --src always was
  manifests.push({ path: p, root: path.resolve(root), photos: m.photos });
}

const results = [];
const failures = [];

for (const { root, photos } of manifests) {
for (const photo of photos) {
  const src = path.join(root, photo.source);
  if (!existsSync(src)) {
    failures.push({ ...photo, reason: 'source not found' });
    continue;
  }

  const outDir = path.join(OUT_ROOT, photo.category);
  const outPath = path.join(outDir, `${photo.slug}.webp`);

  let decoded;
  try {
    decoded = await decode(src);
    const pipeline = sharp(decoded)
      .rotate()
      .resize(sizing(photo.aspect))
      .webp({ quality: QUALITY });

    if (args.dry) {
      const meta = await pipeline.toBuffer({ resolveWithObject: true });
      results.push({ ...photo, width: meta.info.width, height: meta.info.height, bytes: meta.info.size, path: outPath });
    } else {
      await mkdir(outDir, { recursive: true });
      const info = await pipeline.toFile(outPath);
      results.push({ ...photo, width: info.width, height: info.height, bytes: info.size, path: outPath });
    }
  } catch (err) {
    failures.push({ ...photo, reason: err.message.split('\n')[0].slice(0, 90) });
  } finally {
    // only remove files we created, never the originals
    if (decoded && decoded !== src) await rm(decoded, { force: true });
  }
}
}

// Group by category so each section imports only what it needs.
const byCategory = {};
for (const r of results) {
  (byCategory[r.category] ??= []).push({
    src: `${OUT_ROOT}/${r.category}/${r.slug}.webp`,
    slug: r.slug,
    alt: r.alt,
    caption: r.caption,
    width: r.width,
    height: r.height,
    ...(r.flyer ? { flyer: true } : {}),
  });
}

if (!args.dry) {
  await mkdir(path.dirname(DATA_OUT), { recursive: true });
  const body = Object.entries(byCategory)
    .map(([cat, items]) => `export const ${cat} = ${JSON.stringify(items, null, 2)};`)
    .join('\n\n');
  await writeFile(
    DATA_OUT,
    `// GENERATED by scripts/images.mjs - do not edit by hand.\n` +
    `// Regenerate: node scripts/images.mjs --src "<folder>" --manifest scripts/manifests/<file>.json\n\n` +
    `${body}\n`
  );
}

const totalKB = results.reduce((a, r) => a + r.bytes, 0) / 1024;
const requested = manifests.reduce((a, m) => a + m.photos.length, 0);
console.log(`\n  converted ${results.length}/${requested}  (${totalKB.toFixed(0)} KB total, avg ${(totalKB / (results.length || 1)).toFixed(0)} KB)`);
for (const [cat, items] of Object.entries(byCategory)) console.log(`    ${cat.padEnd(10)} ${items.length}`);
if (!args.dry) console.log(`  wrote ${DATA_OUT}`);
if (failures.length) {
  console.log(`\n  FAILED ${failures.length}:`);
  for (const f of failures) console.log(`    ${f.slug}: ${f.reason}`);
  process.exitCode = 1;
}
