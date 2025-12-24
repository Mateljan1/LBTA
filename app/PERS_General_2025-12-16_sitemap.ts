import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://lagunabeachtennisacademy.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/programs',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/schedules',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/book',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/coaches',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/camps',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/fitness',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/faq',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/match-play',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/pathway-planner',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
