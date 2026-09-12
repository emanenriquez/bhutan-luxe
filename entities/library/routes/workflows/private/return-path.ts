// The `next` query parameter the unlock form follows after a successful unlock.
//
// A document route that finds no valid gate redirects to a library index with
// `?next=<the path that was asked for>`, so the person lands on the document
// they clicked instead of on the index. That parameter comes from the URL bar,
// so it is validated as a same-site library path before anything navigates to
// it: an open redirect on the unlock form would be a phishing gift.

export const NEXT_PARAM = 'next'

const LIBRARY_PREFIX = '/workflows/private/'

/**
 * Return `candidate` if it is a plain, absolute path inside the private
 * library, otherwise null. Rejects anything that could leave the site
 * (protocol-relative `//host`, schemes, backslashes) or walk the tree (`..`).
 */
export function safeReturnPath(candidate: string | null | undefined): string | null {
  if (!candidate) return null
  if (!candidate.startsWith(LIBRARY_PREFIX)) return null
  if (candidate.startsWith('//')) return null
  if (candidate.includes('\\') || candidate.includes('\0')) return null
  if (candidate.split('/').some((segment) => segment === '..' || segment === '.')) return null
  return candidate
}

/** The index URL to send an unauthorised request to, carrying where it wanted to go. */
export function unlockRedirectTarget(indexPath: string, requestedPath: string): string {
  const next = safeReturnPath(requestedPath)
  return next ? `${indexPath}?${NEXT_PARAM}=${encodeURIComponent(next)}` : indexPath
}
