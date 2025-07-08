export const dynamic = 'force-dynamic'
export const revalidate = 0

import PageClient from './page.client'

export default async function Page() {
  return (
    <div>
      <h1>Posts</h1>
      <PageClient />
    </div>
  )
}
