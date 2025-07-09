import { HeaderClient } from './Component.client'
import React from 'react'
import type { Header } from '@/payload-types'

export function Header({ data }: { data: Header }) {
  return <HeaderClient data={data} />
}
