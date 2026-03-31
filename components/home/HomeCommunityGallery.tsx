import MasonryGrid, { type MasonryImageItem } from '@/components/sections/MasonryGrid'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getCachedCommunityCloudinary } from '@/lib/cloudinary-community'
import homepageCopy from '@/data/homepage-copy.json'

type CommunityGalleryItem = {
  src: string
  alt: string
  span?: 'small' | 'medium' | 'large'
  objectPosition?: string
}

type CommunitySection = (typeof homepageCopy)['community'] & {
  gallery: CommunityGalleryItem[]
  /** Cap appended Cloudinary tiles to reduce visual load (static `gallery` is curated first). */
  maxCloudinaryGalleryItems?: number
}

export default async function HomeCommunityGallery() {
  const communitySection = homepageCopy.community as CommunitySection
  const staticItems: MasonryImageItem[] = communitySection.gallery.map((item) => ({
    src: item.src,
    alt: item.alt,
    span: item.span as MasonryImageItem['span'],
    objectPosition: item.objectPosition,
  }))

  const fromCloudinary = await getCachedCommunityCloudinary()
  const cap = communitySection.maxCloudinaryGalleryItems ?? 8
  const items = [...staticItems, ...fromCloudinary.slice(0, Math.max(0, cap))]

  return (
    <section id="community" className="bg-white section-lg">
      <div className="container-lbta">
        <MasonryGrid
          header={
            <AnimatedSection className="text-center mb-12">
              <span className="text-eyebrow mb-4 block">{communitySection.eyebrow}</span>
              <h2 className="font-headline text-headline font-light mb-4">{communitySection.headline}</h2>
              <p className="text-subhead max-w-2xl mx-auto font-light">{communitySection.subline}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="/book"
                  className="btn-primary"
                >
                  Join the Community
                </a>
                <a
                  href="/success-stories"
                  className="btn-secondary"
                >
                  See Player Stories
                </a>
              </div>
            </AnimatedSection>
          }
          items={items}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
    </section>
  )
}
