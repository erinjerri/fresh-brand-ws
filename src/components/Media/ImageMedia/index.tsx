'use client'

import { cn } from '@/utilities/ui'
import React from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const { alt, className, fill, imgClassName, onClick, onLoad, resource, size = 'medium' } = props

  // Type guard to ensure resource is a populated media object
  if (!resource || typeof resource !== 'object') {
    console.warn('ImageMedia: Resource is not a populated media object', resource)
    return null
  }

  const { filename, alt: resourceAlt, url, sizes } = resource

  let imageUrl: string

  if (
    size &&
    sizes &&
    Object.prototype.hasOwnProperty.call(sizes, size) &&
    (sizes as Record<string, { url?: string }>)[size]?.url
  ) {
    // Use the specific size URL if available
    imageUrl = getMediaUrl((sizes as Record<string, { url?: string }>)[size].url!)
  } else if (url) {
    // Use the main URL if available
    imageUrl = getMediaUrl(url)
  } else if (filename) {
    // Fallback to filename-based URL
    imageUrl = getMediaUrl(`/media/${filename}`)
  } else {
    console.warn('ImageMedia: No valid image URL found', resource)
    return null
  }

  return (
    <img
      alt={alt || resourceAlt || ''}
      className={cn(imgClassName, fill && 'absolute inset-0 w-full h-full object-cover')}
      onClick={onClick}
      onLoad={onLoad}
      src={imageUrl}
    />
  )
}
