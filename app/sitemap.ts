import { MetadataRoute } from 'next'
import { getAllPostsMeta } from '@/lib/blog'

// Coach Hub (/coach-hub, /coach-hub/login) is intentionally excluded — noindex, coach-only.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lagunabeachtennisacademy.com'
  const currentDate = new Date()
  const posts = await getAllPostsMeta()
  const blogEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.72,
    },
    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ]

  return [
    // Primary Pages (High Priority)
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/schedules`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    
    // Program Pages
    {
      url: `${baseUrl}/programs/junior`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/programs/adult`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/programs/high-performance`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    
    // Seasonal Programs
    {
      url: `${baseUrl}/camps`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/programs/leagues`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    
    // About & Trust Pages
    {
      url: `${baseUrl}/coaches`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/success-stories`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    
    // Contact & Support
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    
    // Specialty Programs
    {
      url: `${baseUrl}/fitness`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/liveball`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.72,
    },
    {
      url: `${baseUrl}/match-play`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/racquet-rescue`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pathway-planner`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.55,
    },

    // Landing Pages
    {
      url: `${baseUrl}/junior-trial`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/adult-trial`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/beginner-program`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/high-performance-pathway`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/apply-scholarship`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // Additional Program Pages
    {
      url: `${baseUrl}/programs/usta-adult-league`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/programs/utr-match-play`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/utr-tracker`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/philosophy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/coaches/andrew-mateljan`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/coaches/allison-cronk`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.55,
    },
    {
      url: `${baseUrl}/coaches/peter-defrantz`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.55,
    },
    // Note: coaches/michelle-mateljan is intentionally noindex (paused 2026)
    // Note: coaches/robert-lebuhn is a redirect to /coaches (coach inactive)

    // Support
    {
      url: `${baseUrl}/help`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    // Legal Pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    ...blogEntries,
  ]
}

