import { NextRequest, NextResponse } from 'next/server'
import { isPrivateLibraryUnlocked } from '../gate'
import { unlockRedirectTarget } from '../return-path'
import {
  PRIVATE_DOC_HEADERS,
  privateDocsRoot,
  readPrivateDoc,
  resolvePrivateDocPath,
} from '@/entities/library/lib/private-docs'

// Gated file server for the 76 internal documents that used to sit in
// public/workflows/private/ and were therefore served to anyone who knew a URL.
// They now live in private-docs/, which Next does not serve, so this handler is
// the only way in and the gate check is unavoidable.
//
// Route precedence keeps the rest of the library working: the real page.tsx
// routes (e8/team-onboarding, ai-officer-institute/..., ...) and the more
// specific e8/[slug] route both win over this catch-all, so it sees only the
// moved files outside e8/. The e8/*.html documents reach e8/[slug] instead,
// which serves them through the same helper.
export async function GET(req: NextRequest, ctx: { params: { path?: string[] } }) {
  const segments = ctx.params.path ?? []

  // Path validity is decided BEFORE the gate. A traversal attempt is not a
  // locked door someone might hold the key to — it is not a request for this
  // library at all, so it 404s whether or not a valid cookie is attached.
  if (resolvePrivateDocPath(privateDocsRoot(process.cwd()), segments) === null) {
    return new NextResponse('Not found', { status: 404 })
  }

  if (!(await isPrivateLibraryUnlocked())) {
    // Send them to the library index, which renders the unlock form, carrying
    // the requested path so the form can come back here once the cookie is
    // set. A 404 would be a lie for a file that exists, and a bare 403 is a
    // dead end. Same cookie-or-staff rule as the layout, via ../gate.
    return NextResponse.redirect(
      new URL(unlockRedirectTarget('/workflows/private/', req.nextUrl.pathname), req.url),
    )
  }

  const doc = await readPrivateDoc(segments)
  if (doc === null) return new NextResponse('Not found', { status: 404 })

  return new NextResponse(doc.body, {
    status: 200,
    headers: { 'Content-Type': doc.contentType, ...PRIVATE_DOC_HEADERS },
  })
}
