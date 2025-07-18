'use client';

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar';

import { cn } from '@/utilities/ui';
import { useSelectedLayoutSegments } from 'next/navigation';
import { PayloadAdminBar } from '@payloadcms/admin-bar';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import './index.scss';

import { getClientSideURL } from '@/utilities/getURL';

const baseClass = 'admin-bar';

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  projects: {
    plural: 'Projects',
    singular: 'Project',
  },
};

const Title: React.FC = () => <span>Dashboard</span>;

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {};
  const segments = useSelectedLayoutSegments();
  const [show, setShow] = useState(false);
  const safeSegments = segments ?? [];
  const validCollections = Object.keys(collectionLabels) as Array<keyof typeof collectionLabels>;
  const collection = validCollections.includes(safeSegments[1] as any)
    ? (safeSegments[1] as keyof typeof collectionLabels)
    : 'pages';
  const router = useRouter();

  const onAuthChange = React.useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id));
  }, []);

  return (
    <div
      className={cn(baseClass, 'py-2 bg-black text-white', {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: 'font-medium text-white',
            logo: 'text-white',
            user: 'text-white',
          }}
          cmsURL={getClientSideURL()}
          collectionSlug={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || 'Pages',
            singular: collectionLabels[collection]?.singular || 'Page',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview').then(() => {
              router.push('/');
              router.refresh();
            });
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  );
};
