#!/usr/bin/env node
/**
 * Generate square PWA/favicon icons from LBTA logo.
 * Run from repo root: node scripts/generate-lbta-icons.js
 * Overwrites public/icons/icon-*.png with LBTA branding.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SRC = path.join(__dirname, '../public/logos/LBTAblktext.png');
const OUT_DIR = path.join(__dirname, '../public/icons');

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Source logo not found:', SRC);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const buffer = await sharp(SRC)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  const base = await sharp(buffer);

  for (const size of SIZES) {
    const outPath = path.join(OUT_DIR, `icon-${size}x${size}.png`);
    await base
      .clone()
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log('Wrote', outPath);
  }
  console.log('Done. LBTA icons generated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
