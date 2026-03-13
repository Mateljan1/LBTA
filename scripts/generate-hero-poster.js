#!/usr/bin/env node
/**
 * Generates a small hero poster WebP for LCP (video poster + preload).
 * Source: public/images/hero/laguna-horizon.webp
 * Output: public/images/hero/hero-poster.webp (target < 200KB)
 * Run: node scripts/generate-hero-poster.js
 */
const path = require('path')
const fs = require('fs')

async function main() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.error('Run: npm install sharp (devDependency)')
    process.exit(1)
  }

  const src = path.join(process.cwd(), 'public/images/hero/laguna-horizon.webp')
  const out = path.join(process.cwd(), 'public/images/hero/hero-poster.webp')

  if (!fs.existsSync(src)) {
    console.error('Source not found:', src)
    process.exit(1)
  }

  const buf = await sharp(src)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72, effort: 6 })
    .toBuffer()

  fs.writeFileSync(out, buf)
  const kb = (buf.length / 1024).toFixed(1)
  console.log('Wrote', out, `(${kb} KB)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
