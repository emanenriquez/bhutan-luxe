import PrivateUnlockForm from './PrivateUnlockForm'
import { unlockPrivateLibrary } from './actions'
import { isPrivateLibraryUnlocked } from './gate'

// One server-side gate for the whole private workflows library.
//
// The old arrangement gated each page with a client component, which meant the
// page's content was already in the RSC payload by the time the check ran —
// anyone could read it without ever typing a code. This layout shows the unlock
// form instead of `children` when the visitor is locked out.
//
// That alone is the visible UX, not the security boundary. The App Router
// renders a layout and its page in parallel, so a page's output lands in the
// flight payload whether or not the layout places it in the tree; an anonymous
// fetch of the e8 index used to return the form and, behind it, every document
// slug and title. Each page therefore also wraps itself in `gatedPage` from
// ./gate (enforced by scripts/check-private-pages.mjs), which renders nothing
// until the same check passes. Form here, content there, one rule in ./gate.
//
// Reading cookies() makes every route under /workflows/private dynamic. That is
// deliberate: a statically cached private page is the same bug in a new shape.
// The `export const dynamic = 'force-dynamic'` that enforces it sits in the
// app/ mount instead of here: Next reads a segment's config by static analysis
// of the file under app/, and would not see it through a re-export.
export const metadata = {
  robots: { index: false, follow: false },
}

// The cookie-or-staff rule itself lives in ./gate so the document route
// handlers apply exactly the same one.
export default async function PrivateLibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await isPrivateLibraryUnlocked())) {
    return (
      <PrivateUnlockForm
        action={unlockPrivateLibrary}
        title="Private workflows library"
      />
    )
  }

  return <>{children}</>
}
