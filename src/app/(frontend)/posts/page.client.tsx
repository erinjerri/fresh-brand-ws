'use client'

import { useEffect, useState } from 'react'
import { useHeaderTheme } from '@/providers/HeaderTheme'

type GraphQLError = { message: string }

const PageClient = () => {
  const { setHeaderTheme } = useHeaderTheme()

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<GraphQLError | null>(null)

  useEffect(() => {
    setHeaderTheme('light') // Enforce light header theme

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query Posts {
                posts {
                  docs {
                    title
                    slug
                  }
                }
              }
            `,
          }),
        })

        const data = await response.json()
        console.log('Posts data:', data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError({ message: err.message })
        } else {
          setError({ message: 'Unknown error occurred' })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [setHeaderTheme])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return null
}

export default PageClient
