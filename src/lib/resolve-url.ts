/**
 * Resolves an asset path into an absolute URL.
 * Handles both relative paths (e.g. "/logo.png") and already-absolute
 * URLs (e.g. a hotlinked Unsplash photo) without double-prefixing the site base.
 */
export function resolveAssetUrl(base: string, path?: string | null): string | undefined {
  if (!path) return undefined;
  return /^https?:\/\//.test(path) ? path : `${base}${path}`;
}
