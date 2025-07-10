import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from '../../page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Post } from '@/payload-types'
import { CollectionArchive } from '@/components/CollectionArchive'

type Args = {
  params: Promise<{
    pageNumber?: string
  }>
}

export default async function PostsPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { pageNumber = '1' } = await paramsPromise
  const page = parseInt(pageNumber, 10)
  const posts = await queryPosts({ page })

  return (
    <article className="pt-16 pb-24">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={`/posts/page/${pageNumber}`} />

      {draft && <LivePreviewListener />}

      <CollectionArchive posts={posts.docs} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber = '1' } = await paramsPromise
  const page = parseInt(pageNumber, 10)
  const posts = await queryPosts({ page })
  return generateMeta({ doc: posts.docs[0] })
}

const queryPosts = cache(async ({ page }: { page: number }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 10,
    overrideAccess: draft,
    page,
    depth: 2, // Populate media relationships
    sort: '-publishedAt',
  })

  return result
})
