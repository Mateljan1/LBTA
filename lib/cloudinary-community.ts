import 'server-only'

import { unstable_cache } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'

import type { MasonryImageItem } from '@/components/sections/MasonryGrid'

/**
 * Upload images in the Cloudinary Media Library under this folder (public_id prefix).
 * Example: `lbta_website/community/my-photo` → appears below the curated static tiles.
 */
export const CLOUDINARY_COMMUNITY_PREFIX = 'lbta_website/community'

const SPAN_ROTATION: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'small', 'large', 'medium', 'small']

/** Minimal shape from Cloudinary Admin API `resources` list */
interface CloudinaryListedResource {
  public_id: string
  secure_url: string
  context?: { custom?: { caption?: string } }
}

function configureFromEnv(): boolean {
  if (!process.env.CLOUDINARY_URL?.trim()) return false
  // Loads API key, secret, and cloud_name from CLOUDINARY_URL (see Cloudinary Node SDK).
  cloudinary.config(true)
  return true
}

function altFromResource(publicId: string, contextCaption?: string): string {
  const caption = contextCaption?.trim()
  if (caption) return caption
  const leaf = publicId.split('/').pop() ?? 'photo'
  const words = leaf.replace(/[-_]+/g, ' ').replace(/\.[^.]+$/, '')
  return `LBTA community — ${words}`
}

async function listCommunityImagesUncached(): Promise<MasonryImageItem[]> {
  if (!configureFromEnv()) return []

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: CLOUDINARY_COMMUNITY_PREFIX,
      max_results: 60,
      context: true,
    })

    const resources = (result.resources ?? []) as CloudinaryListedResource[]
    return resources.map((r, i) => {
      const custom = r.context?.custom
      const caption = custom?.caption
      return {
        src: r.secure_url,
        alt: altFromResource(r.public_id, caption),
        span: SPAN_ROTATION[i % SPAN_ROTATION.length],
        objectPosition: '50% 40%',
      }
    })
  } catch (err) {
    console.error('[cloudinary] listCommunityImages failed', err)
    return []
  }
}

/**
 * Cached list of Cloudinary-hosted community images (append after static JSON gallery).
 * Revalidates at most once per hour per deployment.
 */
export const getCachedCommunityCloudinary = unstable_cache(
  listCommunityImagesUncached,
  ['cloudinary-community-gallery'],
  { revalidate: 3600 }
)
