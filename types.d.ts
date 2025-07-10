import type { Sharp } from 'sharp'

export type SharpDependency = typeof import('sharp') | Sharp

declare module 'next-sitemap'
