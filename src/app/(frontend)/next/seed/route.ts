import { createLocalReq, getPayload } from 'payload'
import { seed } from '@/endpoints/seed/index.js'
import config from '@payload-config'
import { headers } from 'next/headers'
import type { User } from '@/payload-types'

export const maxDuration = 60 // This function can run for a maximum of 60 seconds

type UserSession = {
  id: string
  createdAt?: string | null
  expiresAt: string
}

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  // Authenticate by passing request headers
  const { user } = await payload.auth({
    headers: requestHeaders,
  })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  // Coerce user to correct shape for BaseUser
  const baseUser = {
    ...user,
    sessions: (user as any).sessions ?? undefined,
    collection: 'users',
  } as any

  try {
    // Create the local request with the authenticated user
    const payloadReq = await createLocalReq(
      {
        user: baseUser,
      },
      payload,
    )

    await seed({ payload, req: payloadReq })
    return Response.json({ success: true })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding data' })
    return new Response('Error seeding data.', { status: 500 })
  }
}
