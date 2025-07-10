import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { CollectionArchive } from '@/components/CollectionArchive'

export default async function Posts() {
  const { isEnabled: draft } = await draftMode()
  const posts = await queryPosts()

  return (
    <article className="pt-16 pb-24">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url="/posts" />

      {draft && <LivePreviewListener />}

      <CollectionArchive posts={posts.docs} />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const posts = await queryPosts()
  return generateMeta({ doc: posts.docs[0] })
}

const queryPosts = cache(async () => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1000,
    overrideAccess: draft,
    pagination: false,
    depth: 2, // Populate media relationships
    sort: '-publishedAt',
  })

  return result
})
