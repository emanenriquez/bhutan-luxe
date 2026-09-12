import { NextRequest, NextResponse } from 'next/server'
import { downloadFresh, isValidSlug } from '@/entities/library/lib/docs'
import { isPrivateLibraryUnlocked } from '../../gate'
import { unlockRedirectTarget } from '../../return-path'
import {
  PRIVATE_DOC_HEADERS,
  looksLikeFileName,
  privateDocsRoot,
  readPrivateDoc,
  resolvePrivateDocPath,
} from '@/entities/library/lib/private-docs'

// Everything under /workflows/private/e8/<something> that is not one of the
// hand-built page routes lands here. Two kinds of document arrive:
//
//  1. Storage documents, published by upload rather than deploy. Their slugs
//     are extension-less and this route appends ".html" when fetching them.
//  2. The moved static documents (…/e8/8-edges-business-model.html and friends).
//     These used to be real files in public/, which won over this dynamic
//     segment; now that they live in private-docs/ nothing outranks [slug]
//     any more, so this route has to serve them itself or they 404.
//
// The gate is the same rule the library layout applies (../../gate): the
// HMAC-signed cookie, or a signed-in staff session. It used to trust a literal
// `edge8_private_ok=1` that any browser could set for itself — which meant this
// route would read Storage with the service-role key for an unauthenticated
// caller. The signed cookie cannot be forged without the server secret. Later it
// checked only the cookie while the layout also accepted staff, so a signed-in
// admin following a document link was bounced to an index that showed neither
// the unlock form nor the document; one shared helper closes that gap, and the
// redirect now carries the requested path so the unlock form can return to it.
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const isFile = looksLikeFileName(slug)

  // Reject an unusable slug of either shape BEFORE looking at the cookie. A
  // traversal attempt is not a locked door someone might hold the key to, so it
  // must 404 rather than be redirected to the unlock form — otherwise the
  // response distinguishes "malformed" from "gated" and hands back a hint.
  const rejected = isFile
    ? resolvePrivateDocPath(privateDocsRoot(process.cwd()), ['e8', slug]) === null
    : !isValidSlug(slug)
  if (rejected) {
    return new NextResponse('Not found', { status: 404 })
  }

  if (!(await isPrivateLibraryUnlocked())) {
    return NextResponse.redirect(
      new URL(unlockRedirectTarget('/workflows/private/e8/', req.nextUrl.pathname), req.url),
    )
  }

  if (isFile) {
    const doc = await readPrivateDoc(['e8', slug])
    if (doc === null) return new NextResponse('Not found', { status: 404 })
    return new NextResponse(doc.body, {
      status: 200,
      headers: { 'Content-Type': doc.contentType, ...PRIVATE_DOC_HEADERS },
    })
  }

  // A repo document reached without its extension (the plan links people pass
  // around drop the ".html") is still that document, not a Storage lookup.
  const repoDoc = await readPrivateDoc(['e8', `${slug}.html`])
  if (repoDoc !== null) {
    return new NextResponse(repoDoc.body, {
      status: 200,
      headers: { 'Content-Type': repoDoc.contentType, ...PRIVATE_DOC_HEADERS },
    })
  }

  const html = await downloadFresh(`${slug}.html`)
  if (html === null) {
    return new NextResponse('Not found', { status: 404 })
  }

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...PRIVATE_DOC_HEADERS },
  })
}
