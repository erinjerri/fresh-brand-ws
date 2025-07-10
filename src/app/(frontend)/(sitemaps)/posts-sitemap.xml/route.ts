import { getServerSideSitemap } from 'next-sitemap';
import { getPayload } from 'payload';
import config from '@payload-config';
import { unstable_cache } from 'next/cache';

const getPostsSitemap = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config });
      const SITE_URL =
        process.env.NEXT_PUBLIC_SERVER_URL ||
        process.env.VERCEL_PROJECT_PRODUCTION_URL ||
        'http://localhost:3000';

      const results = await payload.find({
        collection: 'posts',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      });

      const dateFallback = new Date().toISOString();

      const sitemap = results.docs
        ? results.docs
            .filter((post) => Boolean(post?.slug))
            .map((post) => ({
              loc: `${SITE_URL}/posts/${post?.slug}`,
              lastmod: post.updatedAt || dateFallback,
            }))
        : [];

      return sitemap;
    } catch (error) {
      console.warn('Failed to generate posts sitemap:', error);
      // Return empty sitemap if database is not available
      return [];
    }
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
);

export async function GET() {
  const sitemap = await getPostsSitemap();

  return getServerSideSitemap(sitemap);
}
