import { getAllPostsMeta } from '@/lib/blog'

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET() {
  const posts = await getAllPostsMeta()
  const site = 'https://lagunabeachtennisacademy.com'
  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site}/blog/${p.slug}</link>
      <guid isPermaLink="true">${site}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T17:00:00.000Z`).toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
    </item>`
 )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Laguna Beach Tennis Academy — Journal</title>
    <link>${site}/blog</link>
    <description>Notes on tennis training and programs from LBTA in Laguna Beach, California.</description>
    <language>en-us</language>
    <atom:link href="${site}/blog/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
