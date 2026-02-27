/**
 * Convert any `http://` URL to `https://` for the backend domain.
 *
 * Useful because the CMS/API may return media URLs using the HTTP scheme,
 * which causes mixed-content errors when the front-end is served over HTTPS.
 */

const HTTP_BACKEND_RE = /http:\/\/cvg\.pnehomes\.com/g;

/**
 * Replace all occurrences of `http://cvg.pnehomes.com` with the HTTPS variant
 * inside a raw JSON string, then parse it.
 *
 * Call this instead of `res.json()` on API responses.
 */
export async function parseJsonHttps<T = unknown>(res: Response): Promise<T> {
  const text = await res.text();
  const sanitized = text.replace(HTTP_BACKEND_RE, "https://cvg.pnehomes.com");
  return JSON.parse(sanitized) as T;
}

/**
 * Ensure a single URL string uses HTTPS.
 * Returns the original value unchanged if it is not a recognised HTTP url.
 */
export function ensureHttps(url: string | undefined | null): string {
  if (!url) return "";
  return url.replace(HTTP_BACKEND_RE, "https://cvg.pnehomes.com");
}
