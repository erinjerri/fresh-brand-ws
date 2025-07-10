import type { Metadata } from 'next';
import React from 'react';
import { Footer } from '@/Footer/Component';
import { Header } from '@/Header/Component';
import { Providers } from '@/providers';
import { InitTheme } from '@/providers/Theme/InitTheme';
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph';
import { draftMode } from 'next/headers';
import './globals.css';
import { getServerSideURL } from '@/utilities/getURL';
import { getCachedGlobal } from '@/utilities/getGlobals';
import type { Footer as FooterType, Header as HeaderType } from '@/payload-types';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await draftMode();
  const headerData = await getCachedGlobal('header', 1)();
  const footerData = await getCachedGlobal('footer', 1)();

  return (
    <html className="font-sans" lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <Header data={headerData as HeaderType} />
          {children}
          <Footer data={footerData as FooterType} />
        </Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
};
