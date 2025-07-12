import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig, PayloadRequest } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3';
import { Pages } from './collections/Pages';
import { Posts } from './collections/Posts';
import { Media } from './collections/Media';
import { Categories } from './collections/Categories';
import { Users } from './collections/Users';
import { Header } from './Header/config';
import { Footer } from './Footer/config';
import { plugins } from './plugins';
import { defaultLexical } from '@/fields/defaultLexical';
import { getServerSideURL } from './utilities/getURL';
import { seoPlugin } from '@payloadcms/plugin-seo';
import sharp from 'sharp';
import type { Field } from 'payload';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const isProduction = process.env.NODE_ENV === 'production';

const updatedMedia = {
  ...Media,
  fields: [
    ...(Media.fields || []),
    {
      name: 'prefix',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    } as Field, // Cast it to Payload’s Field type
  ],
};

const pluginsArray = [seoPlugin({}), ...plugins];

if (isProduction) {
  pluginsArray.unshift(
    s3Storage({
      bucket: process.env.SUPABASE_BUCKET || 'fallback-bucket',
      config: {
        endpoint: process.env.SUPABASE_ENDPOINT,
        region: process.env.SUPABASE_REGION,
        credentials: {
          accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID || 'fallback-access-key',
          secretAccessKey: process.env.SUPABASE_SECRET_ACCESS_KEY || 'fallback-secret-key',
        },
        forcePathStyle: true,
      },
      collections: {
        media: true,
      },
    }),
  );
}

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [Pages, Posts, updatedMedia, Categories, Users],
  globals: [Header, Footer],
  cors: [getServerSideURL()].filter(Boolean),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.VERCEL_URL || getServerSideURL() || 'http://localhost:3000',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: pluginsArray,
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true;
        const authHeader = req.headers.get('authorization');
        return authHeader === `Bearer ${process.env.CRON_SECRET}`;
      },
    },
    tasks: [],
  },
  sharp,
});
