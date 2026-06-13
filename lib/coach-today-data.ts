/**
 * Static imports of per-coach Today JSON files.
 *
 * Why static: dynamic fs.readFile in the page route caused Next.js to bundle the
 * entire data/ tree (incl. brochures and assets) into the serverless function
 * (>400mb, blew the 300mb limit). Static imports let Next.js trace dependencies
 * properly so only the JSON files actually used get bundled.
 *
 * Adding a new data-driven coach: import their JSON file here and add to the map.
 * Adding a new date: swap the import path (today's content is one file per coach).
 */

import type { CoachTodayData } from './coach-today-types'

import andrewToday from '@/data/coach-hub/coaching-today/andrew/2026-05-11.json'

const TODAY_DATA: Record<string, CoachTodayData> = {
  andrew: andrewToday as CoachTodayData,
}

export function getCoachTodayData(slug: string): CoachTodayData | null {
  return TODAY_DATA[slug] ?? null
}
