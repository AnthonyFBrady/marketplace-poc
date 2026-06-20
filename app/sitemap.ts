import type { MetadataRoute } from 'next';
import { LISTINGS } from '@/lib/listings';
import { CATEGORIES } from '@/lib/categories';

const BASE = 'https://borrow-marketplace-poc.netlify.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const listings: MetadataRoute.Sitemap = LISTINGS.map((l) => ({
    url: `${BASE}/items/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const seoPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE}/rent/${c.id}/toronto`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...listings,
    ...seoPages,
  ];
}
