#!/usr/bin/env node
/**
 * Encode JPG masters from plans/LBTA_website_pics/LBTA_pics_2 to public/images WebP.
 * Run from repo root: node scripts/encode-lbta-pics2.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'plans/LBTA_website_pics/LBTA_pics_2')

/** @param {import('sharp').Sharp} pipeline */
async function writeWebp(pipeline, outAbs, label) {
  await fs.promises.mkdir(path.dirname(outAbs), { recursive: true })
  await pipeline.toFile(outAbs)
  const st = await fs.promises.stat(outAbs)
  const meta = await sharp(outAbs).metadata()
  console.log(label, '→', path.relative(ROOT, outAbs), `${meta.width}×${meta.height}`, `${(st.size / 1024).toFixed(1)}KB`)
}

async function carousel1920x1080(srcName, outRel) {
  const inp = path.join(SRC, srcName)
  const out = path.join(ROOT, outRel)
  const pipeline = sharp(inp)
    .rotate()
    .resize(1920, 1080, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88, effort: 4 })
  await writeWebp(pipeline, out, srcName)
}

/** 4:3 cards (philosophy pillars, program row) — 1600×1200 for retina `sizes` (~33vw / 25vw). */
async function card43(srcName, outRel) {
  const inp = path.join(SRC, srcName)
  const out = path.join(ROOT, outRel)
  const pipeline = sharp(inp)
    .rotate()
    .resize(1600, 1200, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88, effort: 4 })
  await writeWebp(pipeline, out, srcName)
}

/** Homepage + /programs LiveBall card — 4:3, min wide edge 1920. */
async function liveballHeroCard(srcName, outRel) {
  const inp = path.join(SRC, srcName)
  const out = path.join(ROOT, outRel)
  const pipeline = sharp(inp)
    .rotate()
    .resize(1920, 1440, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88, effort: 4 })
  await writeWebp(pipeline, out, srcName)
}

async function tileSquare(srcName, outRel, quality = 78) {
  const inp = path.join(SRC, srcName)
  const out = path.join(ROOT, outRel)
  const pipeline = sharp(inp).rotate().resize(800, 800, { fit: 'cover', position: 'centre' }).webp({ quality, effort: 4 })
  await writeWebp(pipeline, out, srcName)
}

async function main() {
  console.log('Source:', SRC)
  await carousel1920x1080('Karue_FH_hero.jpg', 'public/images/results/karue-fh-hero.webp')
  await carousel1920x1080('olov hero.jpg', 'public/images/results/olov-hero-lbta-pics2.webp')
  await carousel1920x1080('Henry_mateljan_4.6_UTR_9yrs_old.jpg', 'public/images/success-stories/henry-lbta-pics2.webp')
  await liveballHeroCard('Advanced_liveball.jpg', 'public/images/liveball/hero-doubles.webp')

  await card43('Junior Development 11 yr old.jpg', 'public/images/programs/junior-development-lbta-pics2.webp')
  await card43('Adult_advanced.jpg', 'public/images/programs/adult-lbta-pics2.webp')
  await card43('Coach_michelle_private.jpg', 'public/images/programs/private-michelle-lbta-pics2.webp')
  await card43('Intermediate clinis.jpg', 'public/images/philosophy/movement-clinic-lbta-pics2.webp')
  await card43('HP_class.jpg', 'public/images/philosophy/craft-hp-class-lbta-pics2.webp')

  await tileSquare('Community_1.jpg', 'public/images/community/lbta-pics2-masonry-01.webp', 68)
  await tileSquare('community_2.jpg', 'public/images/community/lbta-pics2-masonry-02.webp')
  await tileSquare('Advanced_liveball.jpg', 'public/images/community/lbta-pics2-liveball-advanced.webp')
  await tileSquare('Liveball_Intermediate.jpg', 'public/images/community/lbta-pics2-liveball-intermediate.webp')
  await tileSquare('coach_michelle_vibes.jpg', 'public/images/community/lbta-pics2-michelle-vibes.webp')
  await tileSquare('Group Fitness_moulton_meadows.jpg', 'public/images/community/lbta-pics2-group-fitness-moulton.webp')
  await tileSquare('Group_fitness_moulton_meads_2.jpg', 'public/images/community/lbta-pics2-group-fitness-moulton-2.webp')
  await tileSquare('LBHS_location.jpg', 'public/images/community/lbta-pics2-lbhs-location.webp')
  await tileSquare('Location_3.jpg', 'public/images/community/lbta-pics2-location-3.webp')
  await tileSquare('Adult_advanced (2).jpg', 'public/images/community/lbta-pics2-adult-advanced-2.webp')
  await tileSquare('15.jpg', 'public/images/community/lbta-pics2-15.webp')
  await tileSquare('adult class.jpg', 'public/images/community/lbta-pics2-adult-class.webp')

  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
