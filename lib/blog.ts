import 'server-only'

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

const POSTS_DIR = path.join(process.cwd(), 'content/blog')

const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  updated: z.string().optional(),
  author: z.string().optional(),
  image: z.string().optional(),
})

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  author: string
  /** Optional per-post hero image URL (relative to /public). Falls back to brand default if absent. */
  image?: string
}

export type BlogPost = BlogPostMeta & { content: string }

function safeSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

function metaFromData(data: unknown, slug: string): BlogPostMeta | null {
  const parsed = frontmatterSchema.safeParse(data)
  if (!parsed.success) return null
  const d = parsed.data
  return {
    slug,
    title: d.title,
    description: d.description,
    date: d.date,
    updated: d.updated,
    author: d.author ?? 'Laguna Beach Tennis Academy',
    image: d.image,
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const files = await fs.readdir(POSTS_DIR).catch(() => [])
  return files
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .filter(safeSlug)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!safeSlug(slug)) return null
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  const raw = await fs.readFile(filePath, 'utf8').catch(() => null)
  if (!raw) return null
  const { data, content } = matter(raw)
  const meta = metaFromData(data, slug)
  if (!meta) return null
  return { ...meta, content }
}

export async function getAllPostsMeta(): Promise<BlogPostMeta[]> {
  const slugs = await getPostSlugs()
  const metas = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await fs.readFile(path.join(POSTS_DIR, `${slug}.md`), 'utf8').catch(() => null)
      if (!raw) return null
      const { data } = matter(raw)
      return metaFromData(data, slug)
    })
  )
  return metas
    .filter((m): m is BlogPostMeta => m !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
