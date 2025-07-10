// Removed unused import

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export function getMediaUrl(path: string, cacheTag?: string): string {
  // Always use the public base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  let url = `${baseUrl}${path}`;
  if (cacheTag) {
    url += `?updatedAt=${cacheTag}`;
  }
  return url;
}
